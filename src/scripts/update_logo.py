import re

with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

new_content = re.sub(
    r'<div class="invoice-header">.*?</div>',
    '<div class="invoice-header">\n                            <img src="newlogoAl.png" class="invoice-logo-img" style="width: 100%; height: auto; display: block; object-fit: contain;">\n                        </div>',
    content,
    flags=re.DOTALL
)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(new_content)
