export default function(layout, vector) {
    for (let [id, position] of layout) {
        layout.set(id, position.add(vector));
    }
    return layout;
}