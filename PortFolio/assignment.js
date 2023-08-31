import { Page } from 'puppeteer';

function get_element_attributes(element_info) {
  const tag = element_info.tag;
  const attrs = element_info.attributes;
  const value = element_info.value;
  const innerText = element_info.innerText;
  const xpath = element_info.xpath;

  const attr_dict = {};

  attr_dict = Object.entries(attrs).reduce((acc, [key, value]) => {
    acc[key] = value;
    return acc;
  }, {});

  if (tag in ['button', 'textarea', 'option'] || attrs.role in ['button', 'checkbox', 'radio'] || attr_dict.type in ['submit', 'checkbox', 'radio']) {
    if (value === undefined || value === '') {
      value = innerText;
    }
    if (value !== undefined && value !== '') {
      attr_dict.value = value;
    }
  } else if (tag === 'input' && attrs.type !== 'submit' || attr_dict.role === 'textarea') {
    value = attrs.value;
  }

  return attr_dict;
}

function crawl(url) {
  const page = new Page();
  page.goto(url);
  const html = page.content();
  const parser = new DOMParser();
  const tree = parser.parseFromString(html, 'text/html');

  const elements = [];
  for (const node of tree.querySelectorAll('*')) {
    elements.push(get_element_attributes(node));
  }

  return elements;
}

const elements = crawl('https://www.google.com');

const ul = document.getElementById('elements');
for (const element of elements) {
  const li = document.createElement('li');
  li.innerHTML = JSON.stringify(element, null, 2);
  ul.appendChild(li);
}
