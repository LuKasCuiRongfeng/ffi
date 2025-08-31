import "./App.css";

function App() {
    return (
        <div>
            <button
                onClick={() => {
                    const res = window.ipcRenderer.send(
                        "test",
                        "hello from renderer",
                    );
                    console.log(res);
                }}
            >
                testdfasdf
            </button>
        </div>
    );
}

export default App;
