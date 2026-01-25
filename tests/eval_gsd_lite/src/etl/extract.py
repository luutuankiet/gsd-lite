import csv

def read_csv(file_path):
    """
    Reads a CSV file and returns a list of dictionaries.
    """
    data = []
    try:
        with open(file_path, mode='r', encoding='utf-8') as f:
            reader = csv.DictReader(f)
            for row in reader:
                data.append(row)
    except FileNotFoundError:
        print(f"Error: File not found at {file_path}")
        return []
    return data
