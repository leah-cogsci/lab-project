//File for all animations
//Animations are implemented using the Composite pattern, e.g animations are composed out of smaller animations.
//AnimationComponent is the common interface for all animations. To define animations, derive from this class
//AnimationComposite can contain other animations (e.g any AnimationComponent-s) and will play them in order when
//called for it.
//AnimationLeaf is a helper class for building blocks - simple animations that only act on 1 actor

//AnimationComponent.play() accepts a list of actors, e.g html element that are to be animated. Thus, any animation
//can be pre-defined and then used on any elements with appropriate properties.
//To compose animations in AnimationComposite, add() accepts actor_indices - indices of which actors that will be
//passed to play() are to be passed to this sub-component. For example, AnimationComposite can define an animation
//that animates 2 elements, one animation for each element. Then add() for the first animation will take indice 0,
//while add() for second animation will take indice 1

const monster_walk_speed = 4;

class AnimationComponent {
    constructor() {
        this.tl = undefined;
        this.finished_callback = undefined;
        this.loop = false;
    }

    play(actors) {
        this.actors = actors;
        //anime.js reset does not seem to always work, so we do a manual backup/reset of style
        this.pre_play_styles = this.actors.map((act) => {
            if(act) {
                return act.style.cssText;
            } else {
                return undefined;
            }
        });
        actors.forEach((act) => {
            if(act) {
                anime.set(act, {'scaleX': anime.get(act, 'scaleX')}); //Make scale first transform, as order matters
            }
        });
        this._build(actors);
        this.tl.play();
    }

    reset() {
        if(this.tl) {
            this.tl.reset();
            //anime.js reset does not seem to always work, so we do a manual reset of style
            this.actors.forEach((act, i) => {
                if(act) {
                    act.style.cssText = this.pre_play_styles[i];
                }
            });
        }
    }

    _build(actors) {
        this.tl = anime.timeline({
            autoplay: false,
            loop: this.loop
        });
        this._get_animation_params(actors, this.tl).forEach(([anim, time_offset]) => {
            this.tl.add(anim, '+=' + time_offset);
        });
        if(this.finished_callback) {
            this.tl.finished.then(this.finished_callback);
        }
    }

    _get_animation_params(actors) {
        throw new Error("Children of AnimationComponent must override _get_animation_params");
    }

    _time_from_speed_or_duration(distance, speed, duration) {
        if(speed) {
            return Math.abs(1000*parseInt(distance)/speed);
        } else {
            return duration;
        }
    }
}

class AnimationComposite extends AnimationComponent {
    constructor() {
        super();
        this.components = [];
    }

    _get_animation_params(actors, parent_tl) {
        return this.components.map(([indices, animation, time_offset]) => {
            let params = animation._get_animation_params(
                indices.map((index) => {
                    return actors[index];
                }),
                parent_tl
            );
            params[0][1] += time_offset;
            return params;
        }).flat(1);
    }

    add_animation(actor_indices, animation, time_offset=0) {
        this.components.push([actor_indices, animation, time_offset]);
    }
}

class AnimationLeaf extends AnimationComponent {
    _get_animation_params(actors) {
        return [[this._get_leaf_animation(actors[0]), 0]];
    }

    _get_leaf_animation(target) {
        throw new Error("Children of AnimationLeaf must override _get_leaf_animation");
    }
}

class MoveAnimation extends AnimationLeaf {
    constructor(distance, {speed, duration} = {speed:undefined, duration:undefined}) {
        super();
        this.distance = distance;
        this.time = this._time_from_speed_or_duration(distance, speed, duration);
    }

    _get_leaf_animation(target) {
        return {
            targets: target,
            duration: this.time,
            translateX: '+=' + this.distance + 'em',
            easing: "linear",
            autoplay: false,
        };
    }
}


class WalkAnimation extends MoveAnimation {
    constructor(distance, step_srcs, {speed, duration} = {speed: undefined, duration:undefined}) {
        super(distance, {speed: speed, duration: duration});
        this.animation_step_intvl = 2;
        this.step_srcs = step_srcs;
    }

    _get_leaf_animation(target) {
        let result = super._get_leaf_animation(target);
        return {
            ...result,
            ...{
                changeBegin: (anim) => {
                    anim.changes = 0;
                    target.setSrc(this.step_srcs[0]);
                },
                change: (anim) => {
                    anim.changes++;
                    target.setSrc(this.step_srcs[Math.floor((anim.changes % (this.animation_step_intvl * this.step_srcs.length)) / this.animation_step_intvl)]);
                    //carryObj contains throwable objects in some experiment variations
                    //It is a bit hacky solution, but the simplest one
                    if(target.carryObj) {
                        let target_translate = parseFloat(anime.get(target, 'translateX', 'em'));
                        let target_scale = parseFloat(anime.get(target, 'scaleX'));
                        let target_scale_sign = target_scale/Math.abs(target_scale);
    
                        let target_pos = parseFloat(anime.get(target, "left", 'em')) + target_translate*target_scale_sign;
                        let target_width = parseFloat(anime.get(target, "width", 'em'));
                        let offset = target_width * (target_scale_sign == 1 ? 0.6 : -0.5)
    
                        target.carryObj.style.left = target_pos + offset + 'em';
                    }
                },
                complete: (anim) => {
                    target.setSrc(this.step_srcs[0]);
                },
            }
        }
    }
}

class MonsterWalkAnimation extends WalkAnimation {
    constructor(distance) {
        super(distance, [], {speed: monster_walk_speed});
    }

    _get_leaf_animation(target) {
        for(let i = 1; i <= 6; i++) {
            this.step_srcs.push("pictures/monster_" + target.color + "_" + i + ".png");
        }
        return super._get_leaf_animation(target);
    }
}

class ParabolaCurveAnimation extends AnimationLeaf {
    constructor(distance, height, {speed, duration} = {speed:undefined, duration:undefined} ) {
        super();
        this.distance = distance;
        this.height = height;
        this.time = this._time_from_speed_or_duration(distance, speed, duration);
    }

    /**
     * Returns y value of a negative parabola with given peak and intersections with X axis at 0 and 1
     * @param {*} t - value of x for which to get y value, should be between 0 and 1 to get trajectory
     */
    _parametrized_parabola_trajectory(t) {
        return -4*this.height*t*(t - 1)
    }

    _get_leaf_animation(target) {
        return {
            targets: target,
            duration: this.time,
            translateX: '+=' + this.distance + 'em',
            easing: "linear",
            update: (anim) => {
                let y_coord = this._parametrized_parabola_trajectory(anim.progress/100);
                anime.set(target, {'translateY': (anime.get(target, 'translateY', 'em') - y_coord) + 'em'})
            },
            autoplay: false
        };
    }
}

class FallBackAnimation extends AnimationLeaf {
    _get_leaf_animation(target) {
        return {
            targets: target,
            duration: 150,
            translateX: '+=' + (-1) + 'em',
            translateY: '+=' + 2 + 'em',
            rotateZ: '+=' + (-90),
            easing: "linear",
            autoplay: false
        }
    }
}

class TurnAroundAnimation extends AnimationLeaf {
    _get_leaf_animation(target) {
        return {
            targets: target,
            duration: 1,
            scaleX: '*=' + (-1),
            easing: "linear",
            translateX: '*=' + (-1),
            autoplay: false
        }
    }
}

class NoopAnimation extends AnimationLeaf {
    constructor(duration) {
        super();
        this.duration = duration;
    }

    _get_leaf_animation(target) {
        return {
            duration: this.duration,
            autoplay: false
        }
    }
}

class DisappearAnimation extends AnimationLeaf {
    _get_leaf_animation(target) {
        return {
            targets: target,
            duration: 1500,
            opacity: 0,
            easing: 'easeInQuad',
            autoplay: false
        }
    }
}

class BounceAndFallAnimation extends AnimationLeaf {
    constructor(fall_distance, bounce_distance, duration) {
        super();
        this.fall_distance = fall_distance;
        this.bounce_distance = bounce_distance;
        this.duration = duration
    }

    _get_leaf_animation(target) {
        return {
            targets: target,
            duration: this.duration,
            translateY: {
                value: '+=' +  this.fall_distance + 'em',
                easing: 'easeInQuad'
            },
            translateX: {
                value: '+=' + this.bounce_distance + 'em',
                easing: 'linear'
            },
            autoplay: false,
        };
    }
}

class BlinkingAnimation extends AnimationLeaf {
    constructor(interval, blink_point, blink_duration = 150) {
        super();
        this.interval = interval;
        this.blink_point = blink_point;
        this.blink_duration = blink_duration;
        this.blink_point_normal = this.blink_point/this.interval;
        this.blink_duration_normal = this.blink_duration/this.interval;
    }

    _get_leaf_animation(target) {
        return {
            targets: target,
            duration: this.interval,
            opacity: 1,
            easing: () => {
                return (t) => {
                    if(t <= this.blink_point_normal || t >= this.blink_point_normal + this.blink_duration_normal) {
                        return 0;
                    } else {
                        return 1;
                    }
                } 
            },
            autoplay: false
        }
    }
}

/**
 * Special helper class for animations that require current data after previous
 * animations have played. By default, animations can only work with data at the time
 * when play() is called, before any objects were animated. In case this is not sufficient,
 * use this class. 
 * 
 * Callback should accept actors array and parent_tl argument - parent_tl is the anime.js
 * timeline that the animation tree is being built into. This can be used to pause the timeline
 * until a newly defined animation within the callback finishes, giving an illusion of succession. 
 */
class RealtimeAnimation extends AnimationComponent {
    constructor(callback) {
        super();
        this.callback = callback;
    }

    _get_animation_params(actors, parent_tl) {
        return [
            [{
                duration: 50,
                autoplay: false,
                begin: () => {
                    this.callback(actors, parent_tl)
                }
            },
            0]
        ];
    }
}

class DropObjAnimation extends RealtimeAnimation {
    constructor() {
        super((actors) => {
            actors[0].carryObj = undefined;
        })
    }
}


//The below -Action classes have "wins" and "acts" constructors parameters, which directly couple them to the application logic.
//This does make them less reusable, but the alternative would be to have them have them parametrize their respective animations, and the application
//would then need a factory method/abstract factory to map wins, acts into those parameters for every Action and Reaction. That is at this point
//needless complexity as it will most likely never be needed, thus it was decided against it.


// --------- Animations for actions the monster can do to one another - expecting 3 actors - monster_A, monster_B, object --------- //

class JumpActionAnimation extends AnimationComposite {
    constructor(distance_between_monsters, monster_width, left_wins, left_acts) {
        super();
        let acting_monster_index = left_acts ? 0 : 1;
        this.add_animation([acting_monster_index], new MonsterWalkAnimation(distance_between_monsters - monster_width));
        this.add_animation([acting_monster_index], new ParabolaCurveAnimation(2*monster_width, monster_width*1.6, {duration: 500}));
    }
}

class CollisionActionAnimation extends AnimationComposite {
    constructor(distance_between_monsters, monster_width, left_wins, left_acts) {
        super();
        let acting_monster_index = left_acts ? 0 : 1;
        let bounce_monster_index = left_wins ? 1 : 0;
        this.add_animation([acting_monster_index], new MonsterWalkAnimation(distance_between_monsters - monster_width*0.8));
        this.add_animation([bounce_monster_index], new ParabolaCurveAnimation(-monster_width*0.4, monster_width*0.3, {duration: 300}));
    }
}

class ThrowObjectActionAnimation extends AnimationComposite {
    constructor(distance_between_monsters, monster_width, left_wins, left_acts) {
        super();
        let obj_index = 2;
        let obj_direction = left_acts ? 1 : -1;
        let acting_monster_index = left_acts ? 0 : 1;
        this.add_animation([acting_monster_index], new MonsterWalkAnimation(distance_between_monsters/2 - monster_width*0.5));
        this.add_animation([acting_monster_index], new DropObjAnimation());
        this.add_animation([obj_index], new ParabolaCurveAnimation((distance_between_monsters/2 - monster_width*0.5)*obj_direction, 3, {speed: 15}));
        //Make BounceAndFall a new animation so the reaction can start playing while the object is falling to the ground
        this.add_animation([obj_index], new RealtimeAnimation((actors) => {
            let anim = new AnimationComposite();
            anim.add_animation([0], new BounceAndFallAnimation(monster_width*0.8, -monster_width*0.4*obj_direction, 500));
            anim.play(actors);
        }));
    }
}

// --------- Animations for reactions of monsters to actions - expecting 2 actors - the monsters, with the reactor being first --------- //

class DisappearReaction extends AnimationComposite {
    constructor() {
        super();
        let reacting_index = 0;
        this.add_animation([reacting_index], new DisappearAnimation(), 200);
    }
}

class FallBackReaction extends AnimationComposite {
    constructor() {
        super();
        let reacting_index = 0;
        this.add_animation([reacting_index], new FallBackAnimation());
    }
}

class RunAwayReaction extends RealtimeAnimation {
    constructor() {
        super((actors, parent_tl) => {
            parent_tl.pause();
            let replace_anim = new AnimationComposite();

            let loser_translate = parseFloat(anime.get(actors[0], 'translateX', 'em'));
            let loser_scale = parseFloat(anime.get(actors[0], 'scaleX'));
            let other_translate = parseFloat(anime.get(actors[1], 'translateX', 'em'));
            let other_scale = parseFloat(anime.get(actors[1], 'scaleX', 'em'));
            let loser_scale_sign = loser_scale/Math.abs(loser_scale);
            let other_scale_sign = other_scale/Math.abs(other_scale);

            let loser_pos = parseFloat(anime.get(actors[0], "left", 'em')) + loser_translate*loser_scale_sign;
            let other_pos = parseFloat(anime.get(actors[1], "left", 'em')) + other_translate*other_scale_sign;

            let distance = loser_pos - other_pos;
            
            if(loser_scale_sign != distance/Math.abs(distance)) {
                //If the loser is facing the other monster, turn around
                replace_anim.add_animation([0], new TurnAroundAnimation());
            }

            if(distance >= 0) {
                //If other is to the left of loser, run to the right
                replace_anim.add_animation([0], new MonsterWalkAnimation(40 - loser_pos));
            } else {
                replace_anim.add_animation([0], new MonsterWalkAnimation(loser_pos));
            }
            
            replace_anim.finished_callback = () => {
                parent_tl.play();
            }
            replace_anim.play([actors[0]]);
        });
    }
}

function generate_random_walk_animation(duration, bounds, starting_pos, starting_direction) {
	let steps = Math.ceil(duration/1000);
	let animation = new AnimationComposite();
	let current_pos = starting_pos;
	let current_direction = starting_direction;
	let step_distance = monster_walk_speed * 1;
	for(let i = 0; i < steps;) {
		let random = Math.random() * 3;
		if(random < 1) {
			if(current_pos - step_distance >= bounds[0]) {
				if(current_direction == 1) {
					animation.add_animation([0], new TurnAroundAnimation());
				}
				animation.add_animation([0], new MonsterWalkAnimation(step_distance));
				current_pos -= step_distance;
				current_direction = -1;
				i++;
			}
		} else if (random < 2) {
			if(current_pos + step_distance <= bounds[1]) {
				if(current_direction == -1) {
					animation.add_animation([0], new TurnAroundAnimation());
				}
				animation.add_animation([0], new MonsterWalkAnimation(step_distance));
				current_pos += step_distance;
				current_direction = 1;
				i++;
			}
		} else {
			animation.add_animation([0], new NoopAnimation(1000));
			i++;
		}
	}
	if(current_direction != starting_direction) {
		animation.add_animation([0], new TurnAroundAnimation());
	}
	return [animation, current_pos];
}