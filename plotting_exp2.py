import pandas as pd
import matplotlib.pyplot as plt
import math

# create the dataframes
df1 = pd.read_excel("exp2v1.xlsx")
df2 = pd.read_excel("exp2v2.xlsx")

# List of adjectives to plot
adjectives_init = ["great", "pretty good", "okay", "poor", "terrible"]
adjectives_resp = ["amazing", "decent", "interesting", "rather bad", "awful"]
topic_register =["election results", "climate policies", "housing crisis", "jurisdiction", "public transport", "school shootings", "reproductive rights", "animals", "twitter", "immigration laws"]
initial = adjectives_init[4]
df1 = df1[df1["Adjective Initial"]==initial]
df2 = df2[df2["Adjective Initial"]==initial]
# Create a 2x5 subplot
fig, axs = plt.subplots(2, 5, figsize=(15, 6))

# Flatten the subplot array
axs = axs.flatten()

# Iterate through the adjectives and plot a histogram for each
for i, adj in enumerate(adjectives_resp):
    # Filter the dataframes by adjective
    df1_adj = df1[df1['Adjective Response'] == adj]
    df2_adj = df2[df2['Adjective Response'] == adj]
    
    # Get the ratings for the current adjective in each dataframe
    ratings1 = df1_adj['Ratings']
    ratings2 = df2_adj['Ratings']
    
    # Plot the histograms on the current subplots
    counts1, bins1, patches1 = axs[i].hist(ratings1, bins=5, range=(1, 6), rwidth=0.8, align="left", color='blue', alpha=0.5)
    counts2, bins2, patches2 = axs[i+5].hist(ratings2, bins=5, range=(1, 6), rwidth=0.8, align="left", color='green', alpha=0.5)
    
    # Set the x and y axis labels
    axs[i].set_xlabel('Rating')
    axs[i].set_ylabel('Count')
    axs[i+5].set_xlabel('Rating')
    axs[i+5].set_ylabel('Count')
    
    # Set the title of the subplots to the current adjective
    axs[i].set_title(f"Hist {adj} given {initial} - v1", fontsize=8)
    axs[i+5].set_title(f"Hist {adj} given {initial}- v2", fontsize=8)
    
    # Set the x limits and ticks for both subplots
    axs[i].set_xlim([0.5, 5.5])
    axs[i+5].set_xlim([0.5, 5.5])
    axs[i].set_xticks([1,2,3,4,5])
    axs[i+5].set_xticks([1,2,3,4,5])
    
    # Add text labels to the histogram bars for both subplots
    for count, patch in zip(counts1, patches1):
        x = patch.get_x() + patch.get_width() / 2
        y = patch.get_height() 
        axs[i].text(x, y, str(int(count)), ha='center', va='bottom', fontsize=6, fontweight="bold")
    
    for count, patch in zip(counts2, patches2):
        x = patch.get_x() + patch.get_width() / 2
        y = patch.get_height() 
        axs[i+5].text(x, y, str(int(count)), ha='center', va='bottom', fontsize=6, fontweight="bold")



# Adjust the spacing between the subplots
plt.tight_layout()
plt.savefig(f"{initial}_comparison.png")
plt.show()








    
    


    
    


