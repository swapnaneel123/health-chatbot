import os
import shutil
import pandas as pd
from sklearn.model_selection import train_test_split
from transformers import DistilBertTokenizer, DistilBertForSequenceClassification, Trainer, TrainingArguments
import torch

# Load the dataset
df = pd.read_csv("health-chatbot\Symptom2Disease.csv")
df['text'] = df['label'] + " " + df['text']  # Combine label and text
df = df[['text', 'label']]

# Tokenize the dataset
tokenizer = DistilBertTokenizer.from_pretrained("distilbert-base-uncased")

def tokenize_data(df):
    # Tokenize the text and return a dictionary with input_ids and attention_mask
    return tokenizer(df['text'].tolist(), padding=True, truncation=True, max_length=512, return_tensors="pt")

# Tokenize the dataset
tokenized_data = tokenize_data(df)

# Split the dataset
train_texts, val_texts, train_labels, val_labels = train_test_split(
    tokenized_data['input_ids'], df['label'], test_size=0.2
)

# Convert labels to numerical format
label_map = {label: idx for idx, label in enumerate(df['label'].unique())}
train_labels = [label_map[label] for label in train_labels]
val_labels = [label_map[label] for label in val_labels]

# Create PyTorch datasets
class SymptomDataset(torch.utils.data.Dataset):
    def __init__(self, encodings, labels):
        self.encodings = encodings
        self.labels = labels

    def __getitem__(self, idx):
        # Return a dictionary with input_ids, attention_mask, and labels
        item = {
            key: val[idx] for key, val in self.encodings.items()
        }
        item['labels'] = torch.tensor(self.labels[idx])
        return item

    def __len__(self):
        return len(self.labels)

# Prepare datasets
train_dataset = SymptomDataset(
    {"input_ids": train_texts, "attention_mask": tokenized_data["attention_mask"][:len(train_texts)]},
    train_labels
)
val_dataset = SymptomDataset(
    {"input_ids": val_texts, "attention_mask": tokenized_data["attention_mask"][len(train_texts):]},
    val_labels
)

# Load the pre-trained model
model = DistilBertForSequenceClassification.from_pretrained("distilbert-base-uncased", num_labels=len(label_map))

# Define training arguments
training_args = TrainingArguments(
    output_dir="./models/distilbert",
    evaluation_strategy="epoch",  # Use `evaluation_strategy` for older versions of transformers
    learning_rate=2e-5,
    per_device_train_batch_size=16,
    per_device_eval_batch_size=16,
    num_train_epochs=3,
    weight_decay=0.01,
    overwrite_output_dir=True,  # Overwrite the output directory if it exists
)

# Check if the output directory exists and is a valid directory
output_dir = training_args.output_dir
if os.path.exists(output_dir):
    if os.path.isdir(output_dir):
        print(f"Deleting existing directory: {output_dir}")
        shutil.rmtree(output_dir)
    else:
        print(f"Error: {output_dir} is not a directory. Please remove it manually.")
        exit(1)

# Create the output directory
os.makedirs(output_dir, exist_ok=True)

# Initialize the Trainer
trainer = Trainer(
    model=model,
    args=training_args,
    train_dataset=train_dataset,
    eval_dataset=val_dataset,
)

# Train the model
trainer.train()

# Save the model
trainer.save_model(output_dir)
tokenizer.save_pretrained(output_dir)