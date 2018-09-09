export function createFrag (templateId, data){
  let source = document.querySelector(templateId).innerHTML;
  let render = Handlebars.compile(source);
  let template = render(data);
  
  return document.createRange().createContextualFragment(template);
}