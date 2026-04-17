const filename = __dirname + '/data.todo.json';
let list: string[] = null!;

async function loadFromFile() {
    if (list !== null)
        return
    try {
        const file = Bun.file(filename);
        const content = await file.text();
        list = JSON.parse(content) as string[];
    } catch (error) {
        Bun.write(filename, "[]");
        list = [];
    }
}

async function saveToFile() {
    await Bun.write(filename, JSON.stringify(list));
} 

export async function addItem(item: string) {
    await loadFromFile();
    list.push(item);
    await saveToFile();
}

export async function getItems() {
    await loadFromFile();
    return list;
}

export async function updateItem(index: number, newItem: string) {
    await loadFromFile();
    if (index < 0 || index >= list.length)
        throw new Error("Índice fora dos limites");
    list[index] = newItem; 
    await saveToFile();
}

export async function removeItem(index: number) {
    await loadFromFile();
    if (index < 0 || index >= list.length)
        throw new Error("Índice fora dos limites");
    list.splice(index, 1);
    await saveToFile();
}


async function completeItem(index: number) {
  const items = await getItems();

  if (index < 0 || index >= items.length) {
    throw new Error("Índice inválido.");
  }

  items[index] = `[✔] ${items[index]}`;

  await saveItems(items);
}

export default { addItem, getItems, updateItem, removeItem, completeItem}