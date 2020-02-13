import env from 'env-var'

export const PORT = env.get('PORT').default('8080').asPortNumber()
