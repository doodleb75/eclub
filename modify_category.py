import re
import random

def main():
    filepath = r'c:\eclub\pc\pages\category.html'
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Find the block where <div class="product-list">...</div> is defined
    # We will grab all items between <div class="product-list"> and <!-- 하단 페이지네이션 구조 -->
    match = re.search(r'(<div\s+class="product-list">)([\s\S]*?)(<div\s+class="pagination">)', content)
    if not match:
        print("Could not find product-list block")
        return

    prefix = content[:match.end(1)]
    items_html = match.group(2)
    suffix = match.group(3) + content[match.end(3):]

    # Extract the 4 actual product items
    # They are separated by HTML comments. Let's just find all <div class="product-item"...>...</div>
    # Using a simple block extractor
    item_pattern = re.compile(r'(<!--\s*Product Item.*?\n)?(\s*<div class="product-item".*?</div>\s*</div>\s*</div>)', re.DOTALL)
    items = item_pattern.findall(items_html)
    
    if len(items) < 4:
        print(f"Found only {len(items)} items. Expected 4.")
        return

    new_items_html = ""
    for i in range(30):
        # We grab the actual html element from the tuple match
        template_comment, template_body = items[i % 4]
        
        # Modify the template body
        sales = random.randint(10, 1000)
        purchases = random.randint(5, 500)
        is_new = random.randint(0, 100) # higher is newer score
        price_base = random.randint(10, 500) * 100
        
        # change ranking number (e.g. 01위)
        template_body = re.sub(r'(<span class="badge-ranking">)\d+위(</span>)', rf'\g<1>{i+1:02d}위\g<2>', template_body)
        
        # change price (e.g. 36,800원) - only the main price
        template_body = re.sub(r'(<div class="main-price">[\s\S]*?<span class="price">)[0-9,]+원(</span>)', 
                               rf'\g<1>{price_base:,}원\g<2>', template_body)
        
        # Add sorting data attributes to the product-item
        data_attrs = f' data-sales="{sales}" data-purchase="{purchases}" data-new="{is_new}" data-price="{price_base}"'
        if 'data-delivery-type' in template_body:
            template_body = template_body.replace('data-delivery-type', data_attrs + ' data-delivery-type', 1)
        else:
            template_body = template_body.replace('class="product-item"', f'class="product-item"{data_attrs}', 1)
            
        new_items_html += f'\n                        <!-- Product Item {i+1} -->{template_body}'

    new_content = prefix + new_items_html + '\n                    ' + suffix
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(new_content)
    print("Successfully generated 30 product items with random sort data.")

if __name__ == '__main__':
    main()
