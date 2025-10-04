export  const compose =(...funcs:any) =>  {
  const result = funcs.reverse().reduce((acc: any, fn:any) => {
    const next = fn(acc)
    Object.keys(acc).forEach(key => {
      next[key] = acc[key]
    })
    return next
  })
  result.endpoint = funcs[0]
  return result
} 