import pandas as pd
import os

#specify output format
# type_doc = int(input("Do you want a csv (1) or xlsx (2) file? "))

#get file path
if os.path.exists("C:/Users/lb1141/Desktop/Code/jatos_test.txt"):
    file = pd.read_csv(r"C:/Users/lb1141/Desktop/Code/jatos_test.txt", header=None)
    
    
else:
    print("Admin file path unavailable.")
    file_path = input("Please paste your file path here: ")
    file_path = file_path.replace("\\", "/")
    file = pd.read_csv(file_path, header=None)
    
    print("File loaded successfully!")

#for exeriment dataframe
sentences = []
ratings = []
adj_register = ["amazing", "great", "pretty good", "decent", "okay", "interesting", "poor", "rather bad", "terrible", "awful"]
adjectives = []
topic_register =["election results", "climate policies", "housing crisis", "jurisdiction", "public transport", "school shootings", "reproductive rights", "animals", "Twitter", "immigration laws"]
topics =[]

#for demographics dataframe
subject_ids = []
variation_ids = []
language = []
enjoyment =[]
assess = []
age = []
gender =[]
education = []
comments = []
data_sharing = []
times = []



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

#create table for experiment data
df = pd.DataFrame()

df["Sentences"] = sentences
df["Ratings"] = ratings
df["Topics"] = topics
df["Adjectve"] = adjectives

#create table for demographics data
demog = pd.DataFrame()

demog["Subject Ids"] = subject_ids


#output as csv or excel file
# if type_doc == 1:
#     df.to_csv("jatos_res.csv", index=False)
# else:
#     df.to_excel("jatos_res.xlsx", index=False)




        





