def clean_currency(value_str):
    """
    Converts currency string '$1,200.50' to float 1200.50.
    Handles negative values '-$500.00'.
    """
    if not value_str:
        return 0.0
    
    clean_str = value_str.replace('$', '').replace(',', '')
    try:
        return float(clean_str)
    except ValueError:
        return 0.0

def process_transactions(raw_data):
    """
    Transforms raw CSV data into clean records.
    """
    processed = []
    for row in raw_data:
        record = {
            'id': int(row['id']),
            'date': row['date'],
            'description': row['description'].title(),
            'amount': clean_currency(row['amount']),
            'category': row['category']
        }
        processed.append(record)
    return processed
