
<script>
  const handleGoBack = () => {
    if (window.location = '/error') {
      window.history.go(-2);
    } else {
      window.history.back();
    }
    
  }
</script>

<div class="container">
  <span class="icon">❌</span>
  <p class="message">Oops! The page you're looking for doesn't exist.</p>
  <button class="back-button" on:click={handleGoBack}>Go Back</button>
</div>

    <style>
      .container {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 100vh;
        text-align: center;
        background-color: #242529;
      }
    
      .icon {
        font-size: 8rem;
        color: #FF4500;
      }
    
      .message {
        font-size: 3rem;
        margin-top: 16px;
        color: white;
      }
    
      .back-button {
        margin-top: 16px;
        padding: 8px 16px;
        background-color: #007bff; /* Reddit Blue */
        color: #fff;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        transition: background-color 0.3s ease;
        scale: 2.5;
      }
    
      .back-button:hover {
        background-color: #0056b3; /* Darker Blue on Hover */
      }
    </style>