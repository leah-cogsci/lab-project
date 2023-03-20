import pandas as pd
import matplotlib.pyplot as plt
import math

# create the dataframe
df = pd.read_excel("jresults.xlsx")



# List of adjectives to plot
adjectives = ["amazing", "pretty good", "okay", "rather bad", "terrible", "great", "decent", "interesting", "poor", "awful"]
topic_register =["election results", "climate policies", "housing crisis", "jurisdiction", "public transport", "school shootings", "reproductive rights", "animals", "twitter", "immigration laws"]
# topic = topic_register[9]
# df = df[df["Topics"] == topic]


# Create a 2x5 subplot
fig, axs = plt.subplots(2, 5, figsize=(15, 6))

# Flatten the subplot array
axs = axs.flatten()

# Iterate through the adjectives and plot a histogram for each
for i, adj in enumerate(adjectives):
    # Filter the dataframe by adjective
    df_adj = df[df['Adjectve'] == adj]
    
    # Get the ratings for the current adjective
    ratings = df_adj['Ratings']
    
    # Plot the histogram on the current subplot
    counts, bins, patches = axs[i].hist(ratings, bins=5, range=(1, 6), rwidth=0.8, align="left")
    
    # Set the x and y axis labels
    axs[i].set_xlabel('Rating')
    axs[i].set_ylabel('Count')
    
    # Set the title of the subplot to the current adjective
    axs[i].set_title(f"Hist {adj} ")
    axs[i].set_xlim([0.5, 5.5])
    axs[i].set_xticks([1,2,3,4,5])   

    for count, patch in zip(counts, patches):
        x = patch.get_x() + patch.get_width() / 2
        y = patch.get_height() 
        axs[i].text(x, y, str(int(count)), ha='center', va='bottom', fontsize=6, fontweight="bold")


# Adjust the spacing between the subplots
plt.tight_layout()

plt.show()






    
    


    
    


