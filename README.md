# SmartRoute

SmartRoute is a visual and interactive web application for exploring and understanding graph algorithms such as **Dijkstra's Algorithm** and **Breadth-First Search (BFS)**. Users can create custom graphs, select source and destination nodes, and visualize the shortest path and traversal process step-by-step.

---

## 🚀 Features

- **Interactive Graph Editor:** Add, move, and connect nodes visually.
- **Directed & Undirected Graphs:** Toggle between directed and undirected modes.
- **Algorithm Selection:** Choose between Dijkstra's Algorithm and BFS for shortest path calculation.
- **Step-by-Step Animation:** Watch the algorithm progress in real time.
- **Path & Distance Display:** See the shortest path and its total distance.
- **Temporary Node Selection Messages:** Get instant feedback when selecting source/destination nodes.
- **Responsive UI:** Built with React and Tailwind CSS for a modern look.

---

## 🛠️ Tech Stack

- **Frontend:** React, Tailwind CSS, Material UI, React Icons
- **State Management:** React Hooks
- **Visualization:** SVG for graph rendering
- **Build Tool:** Vite

---

## 📦 Installation

1. **Clone the repository:**

   ```sh
   git clone https://github.com/nem-web/SmartRoute.git
   cd SmartRoute
   ```

2. **Install dependencies:**

   ```sh
   npm install
   ```

3. **Start the development server:**

   ```sh
   npm run dev
   ```

4. **Open your browser:**  
   Visit [http://localhost:5173](http://localhost:5173) (or the port shown in your terminal).

---

## 📚 Algorithms Explained

### Dijkstra's Algorithm

- **Purpose:** Finds the shortest path from a source node to all other nodes in a weighted graph (no negative weights).
- **How it works:**
  - Uses a priority queue to always expand the node with the smallest known distance.
  - Updates distances to neighboring nodes if a shorter path is found.
  - Stops when the destination node is reached (for single-pair shortest path).
- **Use case:** Navigation, network routing, etc.

### Breadth-First Search (BFS)

- **Purpose:** Finds the shortest path in an unweighted graph (or when all weights are equal).
- **How it works:**
  - Explores all neighbors at the current depth before moving to the next level.
  - Uses a queue to keep track of the next nodes to visit.
  - The first time the destination is reached, the path is guaranteed to be the shortest.
- **Use case:** Social networks, unweighted routing, puzzle solving.

---

## 🖱️ How to Use

1. **Add Nodes:** Click on the canvas to add nodes.
2. **Connect Nodes:** Click and drag from one node to another to create edges. Double-click edge weights to edit them.
3. **Select Source/Destination:** Double-click a node to set it as the source, then double-click another node to set as destination. Temporary messages will confirm your selection.
4. **Choose Graph Type:** Use the dropdown to switch between directed and undirected graphs.
5. **Select Algorithm:** Use the dropdown to choose Dijkstra or BFS.
6. **Start Animation:** Click "Start" to visualize the algorithm. Use the play/pause/reset controls as needed.
7. **View Results:** The shortest path and its total distance will be displayed in the left panel.

---

## 📂 Project Structure

```
src/
  App.jsx
  main.jsx
  index.css
  canvas/
    components/
      Content/
        index.jsx
      GraphCanvas/
        index.jsx
        styles.css
    utils/
      algorithms.js
      utils.js
```

---

## 📝 License

This project is open-source and available under the [MIT License](LICENSE).

---

## 🙏 Acknowledgements

- [React](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Material UI](https://mui.com/)
- [React Icons](https://react-icons.github.io/react-icons/)
- [Vite](https://vitejs.dev/)

---

## 📧 Contact

For questions or suggestions, open an issue or contact the maintainer via [GitHub](https://github.com/nem-web/SmartRoute).
