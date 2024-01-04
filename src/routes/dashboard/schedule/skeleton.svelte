<script>

</script>

<div class="skeleton-loader"></div>
<div class="skeleton-loader shorter"></div>

<style>
    .skeleton-loader {
      margin-top: 1rem;
      width: 80%;
      height: 20px;
      background: linear-gradient(90deg, #343538 25%, #36373c 50%, #4c4e55 75%);
      background-size: 200% 100%;
      animation: loading 3s infinite;
      margin-bottom: 10px;
    }

    .shorter {
      width: 70%;
    }

.skeleton-loader + .skeleton-loader {
  margin-top: 10px;
}

@keyframes loading {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}


</style>