import sys
import os

# Ensure we can import from src
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from src.etl import extract, transform, load

def main():
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    input_file = os.path.join(base_dir, 'data', 'input.csv')
    db_file = os.path.join(base_dir, 'transactions.db')
    
    print("Starting ETL Pipeline...")
    
    # Extract
    print(f"Reading from {input_file}...")
    raw_data = extract.read_csv(input_file)
    if not raw_data:
        print("No data found. Exiting.")
        return

    # Transform
    print(f"Transforming {len(raw_data)} records...")
    clean_data = transform.process_transactions(raw_data)
    
    # Load
    print(f"Loading to {db_file}...")
    load.init_db(db_file)
    load.save_to_db(clean_data, db_file)
    
    print("Pipeline Complete.")

if __name__ == '__main__':
    main()
