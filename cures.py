import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.preprocessing import MultiLabelBinarizer
from sklearn.multioutput import MultiOutputClassifier
from sklearn.tree import DecisionTreeClassifier
from sklearn.metrics import accuracy_score
import joblib
import pickle

# Load dataset
df = pd.read_csv("health-chatbot\dataset.csv")

# Convert 'cures' column into multi-label format
df["cures"] = df["cures"].apply(lambda x: x.split(","))  # Convert string to list

# Convert symptoms into numerical format using TF-IDF vectorization
vectorizer = TfidfVectorizer()
X = vectorizer.fit_transform(df["symptoms"])

# Use MultiLabelBinarizer to encode multiple cure labels
mlb = MultiLabelBinarizer()
y = mlb.fit_transform(df["cures"])

# Train-test split
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Train a multi-label classifier using Decision Tree
dt_model = MultiOutputClassifier(DecisionTreeClassifier(random_state=42))
dt_model.fit(X_train, y_train)

# Predictions and evaluation
y_pred = dt_model.predict(X_test)

joblib.dump(dt_model,"health-chatbot\cure_trained.pkl")

# Compute accuracy for each label
accuracy = (y_pred == y_test).mean().mean()
print(f"Model Accuracy: {accuracy * 100:.2f}%")

# Function for prediction
def predict_cure(symptom_text):
    symptoms_vector = vectorizer.transform([symptom_text])
    predicted_labels = dt_model.predict(symptoms_vector)
    cures = mlb.inverse_transform(predicted_labels)
    return cures[0] if cures else []

# Example usage
symptoms_input = "fever,cough,sore throat"
predicted_cures = predict_cure(symptoms_input)
print("Predicted Cures:", predicted_cures)
