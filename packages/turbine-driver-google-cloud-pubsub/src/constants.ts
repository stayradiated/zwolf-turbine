import env from 'env-var'

export const PORT = env.get('PORT', '8080').asPortNumber()
