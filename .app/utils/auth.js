export function isTokenExpired() {
  const token = localStorage.getItem('jwt_token')

  // Se não houver token, consideramos que ele está expirado
  if (!token) return true

  try {
    // Decodifica o payload do token JWT
    const decodedToken = JSON.parse(atob(token.split('.')[1]))

    // Obtém o horário atual em segundos
    const currentTime = Math.floor(Date.now() / 1000)

    // Verifica se o token está expirado comparando o campo `exp` com o horário atual
    return decodedToken.exp < currentTime
  }
  catch (error) {
    // Se ocorrer algum erro durante a decodificação, consideramos o token inválido
    console.error('Erro ao decodificar o token JWT:', error)
    return true
  }
}
