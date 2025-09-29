import { useState, useEffect } from 'react'
import './App.css'

interface Quote {
  text: string
  author: string
  category: string
}

const epicQuotes: Quote[] = [
  { text: "The only way to do great work is to love what you do.", author: "Steve Jobs", category: "Inspiration" },
  { text: "Innovation distinguishes between a leader and a follower.", author: "Steve Jobs", category: "Leadership" },
  { text: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt", category: "Dreams" },
  { text: "It does not matter how slowly you go as long as you do not stop.", author: "Confucius", category: "Perseverance" },
  { text: "Everything you've ever wanted is on the other side of fear.", author: "George Addair", category: "Courage" },
  { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill", category: "Success" },
  { text: "Believe you can and you're halfway there.", author: "Theodore Roosevelt", category: "Belief" },
  { text: "The only impossible journey is the one you never begin.", author: "Tony Robbins", category: "Action" },
  { text: "Your time is limited, don't waste it living someone else's life.", author: "Steve Jobs", category: "Life" },
  { text: "The way to get started is to quit talking and begin doing.", author: "Walt Disney", category: "Action" },
  { text: "Don't let yesterday take up too much of today.", author: "Will Rogers", category: "Wisdom" },
  { text: "You learn more from failure than from success. Don't let it stop you.", author: "Unknown", category: "Growth" },
  { text: "It's not whether you get knocked down, it's whether you get up.", author: "Vince Lombardi", category: "Resilience" },
  { text: "If you are working on something that you really care about, you don't have to be pushed.", author: "Steve Jobs", category: "Passion" },
  { text: "People who are crazy enough to think they can change the world, are the ones who do.", author: "Rob Siltanen", category: "Vision" },
  { text: "Failure will never overtake me if my determination to succeed is strong enough.", author: "Og Mandino", category: "Determination" },
  { text: "We may encounter many defeats but we must not be defeated.", author: "Maya Angelou", category: "Strength" },
  { text: "Knowing is not enough; we must apply. Wishing is not enough; we must do.", author: "Johann Wolfgang Von Goethe", category: "Action" },
  { text: "Whether you think you can or think you can't, you're right.", author: "Henry Ford", category: "Mindset" },
  { text: "The two most important days in your life are the day you are born and the day you find out why.", author: "Mark Twain", category: "Purpose" }
]

function App() {
  const [currentQuote, setCurrentQuote] = useState<Quote>(epicQuotes[0])
  const [isAnimating, setIsAnimating] = useState(false)
  const [email, setEmail] = useState('')
  const [subscribeStatus, setSubscribeStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [subscribeMessage, setSubscribeMessage] = useState('')

  const generateNewQuote = () => {
    setIsAnimating(true)
    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * epicQuotes.length)
      setCurrentQuote(epicQuotes[randomIndex])
      setIsAnimating(false)
    }, 300)
  }

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setSubscribeStatus('error')
      setSubscribeMessage('Please enter a valid email address')
      return
    }

    setSubscribeStatus('loading')
    setSubscribeMessage('')

    try {
      const response = await fetch('https://api.subscribe.dev/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          list: 'epic-quotes',
          source: 'epic-quote-generator'
        })
      })

      if (response.ok) {
        setSubscribeStatus('success')
        setSubscribeMessage('Successfully subscribed! Check your email for daily epic quotes.')
        setEmail('')
      } else {
        setSubscribeStatus('error')
        setSubscribeMessage('Failed to subscribe. Please try again later.')
      }
    } catch (error) {
      setSubscribeStatus('error')
      setSubscribeMessage('Network error. Please check your connection and try again.')
    }

    setTimeout(() => {
      setSubscribeStatus('idle')
      setSubscribeMessage('')
    }, 5000)
  }

  useEffect(() => {
    generateNewQuote()
  }, [])

  return (
    <div className="app-container">
      <div className="content">
        <header className="header">
          <h1 className="title">Epic Quote Generator</h1>
          <p className="subtitle">Fuel your inspiration with powerful quotes</p>
        </header>

        <div className={`quote-card ${isAnimating ? 'fade-out' : 'fade-in'}`}>
          <div className="quote-content">
            <svg className="quote-icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M6 17h3l2-4V7H5v6h3zm8 0h3l2-4V7h-6v6h3z"/>
            </svg>
            <blockquote className="quote-text">
              "{currentQuote.text}"
            </blockquote>
            <div className="quote-footer">
              <p className="quote-author">— {currentQuote.author}</p>
              <span className="quote-category">{currentQuote.category}</span>
            </div>
          </div>
        </div>

        <button
          className="generate-btn"
          onClick={generateNewQuote}
          disabled={isAnimating}
          aria-label="Generate new quote"
        >
          {isAnimating ? 'Generating...' : 'Generate New Quote'}
        </button>

        <div className="subscribe-section">
          <h2 className="subscribe-title">Get Daily Epic Quotes</h2>
          <p className="subscribe-description">
            Subscribe to receive inspiring quotes delivered to your inbox every day
          </p>

          <form className="subscribe-form" onSubmit={handleSubscribe}>
            <input
              type="email"
              className="email-input"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={subscribeStatus === 'loading'}
              aria-label="Email address"
            />
            <button
              type="submit"
              className="subscribe-btn"
              disabled={subscribeStatus === 'loading'}
            >
              {subscribeStatus === 'loading' ? 'Subscribing...' : 'Subscribe'}
            </button>
          </form>

          {subscribeMessage && (
            <p className={`subscribe-message ${subscribeStatus}`} role="alert">
              {subscribeMessage}
            </p>
          )}
        </div>

        <footer className="footer">
          <p>Powered by <a href="https://subscribe.dev" target="_blank" rel="noopener noreferrer">Subscribe.dev</a></p>
        </footer>
      </div>
    </div>
  )
}

export default App
