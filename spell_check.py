#!/usr/bin/env python3
"""
Spell checker for products.ts
Checks for common spelling errors and typos
"""

import re
import json
from pathlib import Path

# Common words that might be misspelled
CORRECTIONS = {
    # Common typos
    'recieve': 'receive',
    'occured': 'occurred',
    'seperateoccured': 'occurred',
    'seperate': 'separate',
    'definately': 'definitely',
    'accomodate': 'accommodate',
    'acheive': 'achieve',
    'beleive': 'believe',
    'calender': 'calendar',
    'concious': 'conscious',
    'excelent': 'excellent',
    'experiance': 'experience',
    'familar': 'familiar',
    'finaly': 'finally',
    'goverment': 'government',
    'guarentee': 'guarantee',
    'immediatly': 'immediately',
    'independant': 'independent',
    'maintainance': 'maintenance',
    'necesary': 'necessary',
    'occassion': 'occasion',
    'occured': 'occurred',
    'prefered': 'preferred',
    'reccomend': 'recommend',
    'refered': 'referred',
    'relevent': 'relevant',
    'resistanceoccured': 'occurred',
    'succesful': 'successful',
    'sugest': 'suggest',
    'tommorrow': 'tomorrow',
    'untill': 'until',
    'usefull': 'useful',
    'wierd': 'weird',
    
    # Product-specific potential typos
    'crystall': 'crystallize',
    'crystallizes': 'crystallizes',
    'anitoxidants': 'antioxidants',
    'naturaly': 'naturally',
    'artifical': 'artificial',
    'healty': 'healthy',
    'protien': 'protein',
    'vitamine': 'vitamin',
    'colection': 'collection',
}

def check_spelling(file_path: str):
    """Check for spelling errors in the file"""
    print("=" * 80)
    print("SPELL CHECK REPORT")
    print("=" * 80)
    print(f"\nChecking: {file_path}\n")
    
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
        lines = content.split('\n')
    
    errors_found = []
    
    for line_num, line in enumerate(lines, 1):
        # Skip code structure lines
        if any(x in line for x in ['import ', 'export ', 'const ', 'type ', '};', '};,']):
            continue
            
        # Check for common misspellings
        line_lower = line.lower()
        for wrong, correct in CORRECTIONS.items():
            if wrong in line_lower:
                # Find the actual case in the line
                pattern = re.compile(re.escape(wrong), re.IGNORECASE)
                match = pattern.search(line)
                if match:
                    errors_found.append({
                        'line': line_num,
                        'error': match.group(),
                        'correction': correct,
                        'context': line.strip()[:100]
                    })
    
    if errors_found:
        print(f"❌ FOUND {len(errors_found)} POTENTIAL SPELLING ERRORS:\n")
        for i, error in enumerate(errors_found, 1):
            print(f"{i}. Line {error['line']}:")
            print(f"   Error: '{error['error']}' → Should be: '{error['correction']}'")
            print(f"   Context: {error['context']}")
            print()
    else:
        print("✅ NO SPELLING ERRORS FOUND!\n")
    
    # Additional checks
    print("\n" + "=" * 80)
    print("ADDITIONAL CHECKS")
    print("=" * 80)
    
    # Check for double spaces
    double_spaces = [(i+1, line) for i, line in enumerate(lines) if '  ' in line and 'description' in line.lower()]
    if double_spaces:
        print(f"\n⚠️  Found {len(double_spaces)} lines with double spaces in descriptions:")
        for line_num, line in double_spaces[:5]:
            print(f"   Line {line_num}: {line.strip()[:80]}...")
    else:
        print("\n✅ No double spaces in descriptions")
    
    # Check for missing periods at end of sentences in descriptions
    missing_periods = []
    for i, line in enumerate(lines, 1):
        if 'description:' in line.lower() and not line.strip().endswith(('.",', '",', '.",}', '",}')):
            if 'description:' in line and '"' in line:
                missing_periods.append((i, line.strip()[:80]))
    
    if missing_periods:
        print(f"\n⚠️  Found {len(missing_periods)} descriptions possibly missing periods:")
        for line_num, line in missing_periods[:5]:
            print(f"   Line {line_num}: ...{line[-50:]}")
    
    print("\n" + "=" * 80)
    print("SPELL CHECK COMPLETE")
    print("=" * 80)
    
    return errors_found

if __name__ == '__main__':
    products_file = '/home/leo/Desktop/JKC cursor/src/app/lib/products.ts'
    check_spelling(products_file)
