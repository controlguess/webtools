(() => {
    const openerWindow = window.opener;

    if (!openerWindow) {
        document.body.innerHTML = `
            <h1>No opener found</h1>
            <p>This window wasn't opened by another page.</p>
        `;
        return;
    }

    document.body.innerHTML = `
        <style>
            body {
                font-family: Arial, sans-serif;
                background: #111;
                color: white;
                padding: 30px;
            }

            button {
                padding: 10px 16px;
                cursor: pointer;
                border: none;
                border-radius: 6px;
            }
        </style>

        <h1>My Tool</h1>

        <button id="changeTitle">
            Change Opening Page Title
        </button>
    `;

    document.getElementById("changeTitle").addEventListener("click", () => {
        openerWindow.document.title = "Changed by Tool";
    });
})();
