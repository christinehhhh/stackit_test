import dotenv from 'dotenv'

if (process.env.NODE_ENV === 'development') {
  dotenv.config({ path: '.env.development' })
} else {
  dotenv.config()
}

import app from './app'

const port = process.env.port || 3000

app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})
