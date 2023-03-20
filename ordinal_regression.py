
from mord import OrdinalRidge
import pandas as pd

# Load your data into a pandas DataFrame
data = pd.read_csv("your_data.csv")

# Create X (predictor variables) and y (response variable) from your data
X = data["Adjective Initial"].values.reshape(-1, 1) # Reshape to 2D array
y = data["Ratings"]

# Initialize the OrdinalRidge model with the desired hyperparameters
model = OrdinalRidge(alpha=1.0)

# Fit the model to the data
model.fit(X, y)

# Print the model coefficients
print("Model Coefficients:", model.coef_)

# Compute the R^2 score of the model
print("Model R^2 Score:", model.score(X, y))
