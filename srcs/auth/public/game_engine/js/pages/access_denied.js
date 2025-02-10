export default function Access_Denied()
{
    return `
    <body>
        <style>
        body
            {
                display: flex;
                justify-content: center;
                align-items: center;
                height: 100vh;
                background-color: #520c12;
                font-family: Arial, sans-serif;
                color: #721c24;
                text-align: center;
            }
            .error-container
            {
                padding: 20px;
                background: rgb(224, 151, 16);
                border: 2px solid #f5c6cb;
                border-radius: 10px;
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            }
        </style>
        <div class="error-container">
            <h1>403 - Access Denied</h1>
            <p>Accessing unauthenticated page!!</p>
        </div>
    </body>
    `;
}
