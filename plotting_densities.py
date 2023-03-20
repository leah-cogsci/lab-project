import pandas as pd
import matplotlib.pyplot as plt
import math
import numpy as np
from scipy.stats import gaussian_kde

# create the dataframe
df = pd.read_excel("jresults.xlsx")



# List of adjectives to plot
adjectives = ["amazing", "pretty good", "okay", "rather bad", "terrible", "great", "decent", "interesting", "poor", "awful"]

topic_register =["election results", "climate policies", "housing crisis", "jurisdiction", "public transport", "school shootings", "reproductive rights", "animals", "twitter", "immigration laws"]
#for the density curves
colors = ['blue', 'red', 'green', 'purple', 'orange', 'brown', 'gray', 'pink', 'olive', 'cyan']


# Create a 2x5 subplot
fig, axs = plt.subplots(2, 5, figsize=(20, 8))

# Flatten the subplot array
axs = axs.flatten()

# Iterate through the adjectives and plot a histogram for each
for i, adj in enumerate(adjectives):
    # Filter the dataframe by adjective
    df_adj = df[df['Adjectve'] == adj]

    max_yvalues = []
    
    for j, topic in enumerate(topic_register):
        # Filter the dataframe by topic
        df_topic = df_adj[df_adj['Topics'] == topic]
        
        # Get the ratings for the current topic
        ratings = df_topic['Ratings']
        
        # Create a density curve for the current topic
        density = gaussian_kde(ratings)
        x = np.linspace(min(ratings), max(ratings), 100)
        y = density(x)

        bin_width = x[1] - x[0]
        area = sum(y * bin_width)
        y = y / area
        
        # Plot the density curve on the current subplot
        axs[i].plot(x, y, color=colors[j], linewidth=0.5)
        axs[i].fill_between(x, 0, y, alpha=0.3, color=colors[j])

        max_yvalues.append(max(y))
    
    axs[i].set_ylim([0, max(max_yvalues)*1.1])
    # Set the x and y axis labels
    axs[i].set_xlabel('Rating')
    axs[i].set_ylabel('Density')
    
    # Set the title of the subplot to the current adjective
    axs[i].set_title(f"Density Curve {adj}")
    axs[i].set_xlim([0.5, 5.5])
    axs[i].set_xticks([1,2,3,4,5])   

topic_lines = [plt.Line2D([0], [0], color=colors[i], linewidth=0.5) for i in range(len(topic_register))]
fig.legend(topic_lines, topic_register, loc='center left', fontsize=5)
# Adjust the spacing between the subplots
plt.tight_layout()
plt.show()







    
    


    
    


