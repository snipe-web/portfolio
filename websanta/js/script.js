const table = document.querySelector('table')

table.style.opacity = '0'
table.style.transform = 'translateY(20px)'
table.style.transition = 'all 0.6s ease'

setTimeout(() => {
  table.style.opacity = '1'
  table.style.transform = 'translateY(0)'
}, 100)

function createSnowflakes() {
  const snowflakesContainer = document.querySelector('.snowflakes')
  const snowflakeCount = 50
  const snowflakeChars = ['❄', '❅', '❆']

  for (let i = 0; i < snowflakeCount; i++) {
    const snowflake = document.createElement('div')
    snowflake.className = 'snowflake'
    
    snowflake.textContent = snowflakeChars[Math.floor(Math.random() * snowflakeChars.length)]
    
    const startPosition = Math.random() * 100
    snowflake.style.left = `${startPosition}%`
    
    const size = Math.random() * 15 + 10
    snowflake.style.fontSize = `${size}px`
    
    const fallDuration = Math.random() * 15 + 10
    const swayRotateDuration = Math.random() * 4 + 3
    snowflake.style.animationDuration = `${fallDuration}s, ${swayRotateDuration}s`
    
    const delay = -(Math.random() * fallDuration)
    snowflake.style.animationDelay = `${delay}s, ${Math.random() * swayRotateDuration}s`
    
    if (Math.random() > 0.5) {
      snowflake.style.animationDirection = 'normal, reverse'
    }
    
    const opacity = Math.random() * 0.5 + 0.5
    snowflake.style.opacity = opacity
    
    snowflakesContainer.appendChild(snowflake)
  }
}

createSnowflakes()
