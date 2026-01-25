import sqlite3

def init_db(db_path):
    """
    Initializes the SQLite database with the transactions table.
    """
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS transactions (
            id INTEGER PRIMARY KEY,
            date TEXT,
            description TEXT,
            amount REAL,
            category TEXT
        )
    ''')
    conn.commit()
    conn.close()

def save_to_db(data, db_path):
    """
    Saves processed data to SQLite.
    """
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    # Clear existing data for idempotency in this simple simulation
    cursor.execute('DELETE FROM transactions')
    
    for row in data:
        cursor.execute('''
            INSERT INTO transactions (id, date, description, amount, category)
            VALUES (?, ?, ?, ?, ?)
        ''', (row['id'], row['date'], row['description'], row['amount'], row['category']))
    
    conn.commit()
    print(f"Loaded {len(data)} records into {db_path}")
    conn.close()
