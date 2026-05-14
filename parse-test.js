import Parser from 'web-tree-sitter';
async function test() {
  await Parser.init();
  const parser = new Parser();
  const Lang = await Parser.Language.load('./public/tree-sitter-javascript.wasm');
  parser.setLanguage(Lang);
  const tree = parser.parse('function test() { console.log("hello"); }');
  console.log(tree.rootNode.toString());
  const query = Lang.query('(function_declaration name: (identifier) @name)');
  const captures = query.captures(tree.rootNode);
  console.log(captures.map(c => c.name + ':' + c.node.text));
}
test();
