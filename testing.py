import pandas as pd
import os

#type_doc = int(input("Do you want a csv (1) or xlsx (2) file? "))

file = pd.read_csv(r"C:/Users/lb1141/Desktop/Code/jresults.txt", header=None)

#for exeriment dataframe
sentences = []
ratings = []
adj_register = ["amazing", "great", "pretty good", "decent", "okay", "interesting", "poor", "rather bad", "terrible", "awful"]
adjectives = []
topic_register =["election results", "climate policies", "housing crisis", "jurisdiction", "public transport", "school shootings", "reproductive rights", "animals", "Twitter", "immigration laws"]
topics =[]

#for demographics dataframe
subject_ids = []
language = []
enjoyment =[]
assess = []
age = []
gender =[]
education = []
comments = []
times = []

#zip lists for demographics loop and selected entries
indices = [105, 106, 107, 108, 109, 110, 111, 113]
categs = [language, enjoyment, assess, age, gender, education, comments, times]

stacked = list(zip(indices, categs))



#filter through this horribly formatted data output
for index, rows in file.iterrows():
        for i in range(50):
            sentence = file.loc[index,i]
            sentence = sentence.replace("[","").replace("]","").replace('"','')
            sentences.append(sentence)
            for adj in adj_register:
                 if adj in sentence:
                      adjectives.append(adj)
            for topic in topic_register:
                 if topic in sentence:
                      topics.append(topic.lower())
                      
        for j in range(50,100):
            rating_raw = str(file.loc[index,j])
            rating = rating_raw[:1]
            rating_raw = rating_raw.replace('"',"")
            ratings.append(int(rating))
            # get subject id from haunted cell in data
            if "subject_id" in rating_raw:
                 si = rating_raw.split(":")
                 subject_ids.append(si[-1])
        
        #fill in remainder of demographics based on categories selected
        for ind, cat in stacked:
            item = file.loc[index, ind]
            item = item.replace('"',"").replace("{","").replace("}","")
            added = item.split(":")
            cat.append(added[-1])
            

#create table for experiment data
df = pd.DataFrame()

df["Sentences"] = sentences
df["Ratings"] = ratings
df["Topics"] = topics
df["Adjectve"] = adjectives

#create table for demographics data
demog = pd.DataFrame()

demog["Subject Ids"] = subject_ids
demog["Languages"] = language
demog["Enjoyment"] = enjoyment
demog["Assess"] = assess
demog["Age"] = age
demog["Gender"] = gender
demog["Education"] = education
demog["Comments"] = comments
demog["Times"] = times


mean_times = demog["Times"].astype(float).mean()
print("Mean time:", mean_times)
median_times = demog["Times"].astype(float).median()
print("Median time:", median_times)
std_times = demog["Times"].astype(float).std()
print("Standard deviation of times:", std_times)
# if type_doc == 1:
#     df.to_csv("jresults.csv", index=False)
#     demog.to_csv("jdemog.csv", index=False)
# else:
#     df.to_excel("jresults.xlsx", index=False)
#     demog.to_excel("jdemog.xlsx", index=False)

