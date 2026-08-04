import sys

content = open('c:\\Users\\pc\\Desktop\\Alover Invoice\\index.html', 'r', encoding='utf-8').read()

target = '''                                        <div style="display: flex; gap: 0.5rem; justify-content: flex-end; align-items: baseline; font-size: 21px;">
                                            <span style="font-weight: bold; color: black;">Invoice No:</span>
                                            <span id="prev-serial" style="color: red; font-weight: bold;">2344</span>
                                        </div>
                                        <div style="display: flex; gap: 0.5rem; justify-content: flex-end; align-items: baseline; font-size: 20px;">
                                            <span style="color: black;">Date:</span>
                                            <span id="prev-date" style="color: black;">2023-10-27</span>
                                        </div>'''

replacement = '''                                        <div style="display: flex; gap: 0.5rem; justify-content: flex-end; align-items: baseline; font-size: 20px;">
                                            <span style="font-weight: bold; color: black;">Invoice No:</span>
                                            <span id="prev-serial" style="color: red; font-weight: bold;">2344</span>
                                        </div>
                                        <div style="display: flex; gap: 0.5rem; justify-content: flex-end; align-items: baseline; font-size: 18px;">
                                            <span style="color: black;">Date:</span>
                                            <span id="prev-date" style="color: black;">2023-10-27</span>
                                        </div>'''

if target in content:
    new_content = content.replace(target, replacement)
    open('c:\\Users\\pc\\Desktop\\Alover Invoice\\index.html', 'w', encoding='utf-8').write(new_content)
    print("Done")
else:
    print("Target not found")
