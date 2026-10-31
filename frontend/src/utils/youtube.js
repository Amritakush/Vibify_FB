let apiPromise

// YouTube ka IFrame API ek baar load karo, aur taiyar hone par window.YT do
export function loadYouTubeApi() {
  if (window.YT && window.YT.Player) return Promise.resolve(window.YT)

  if (!apiPromise) {
    apiPromise = new Promise((resolve, reject) => {
      const previous = window.onYouTubeIframeAPIReady
      window.onYouTubeIframeAPIReady = () => {
        previous?.()
        resolve(window.YT)
      }

      const script = document.createElement('script')
      script.src = 'https://www.youtube.com/iframe_api'
      script.async = true
      script.onerror = () => {
        apiPromise = undefined // agli baar dobara koshish ho sake
        reject(new Error('Could not load the YouTube player. Check your internet connection.'))
      }
      document.head.appendChild(script)
    })
  }

  return apiPromise
}