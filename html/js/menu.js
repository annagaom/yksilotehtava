

const makeFetch = async (url) => {
  const result = await fetch(url)

  return await result.json()
}

const fetchRestaurants = async () =>
  await makeFetch("https://10.120.32.94/restaurant/api/v1/restaurants")

const fetchDailyMenuFi = async (id) =>
  makeFetch(`https://10.120.32.94/restaurant/api/v1/restaurants/daily/${id}/${idKieli}`)

const fetchDailyMenuEn = async (id) =>
  makeFetch(`https://10.120.32.94/restaurant/api/v1/restaurants/daily/${id}/${idKieli}`)

const fetchWeeklyMenuFi = async (id) =>
  makeFetch(`https://10.120.32.94/restaurant/api/v1/restaurants/weekly/${id}/${idKieli}`)

const fetchWeeklyMenuEn = async (id) =>
  makeFetch(`https://10.120.32.94/restaurant/api/v1/restaurants/weekly/${id}/${idKieli}`)

  function success(pos) {
    const crd = pos.coords;

  }

  /* creat dialog info */

const createPhoneLink = (phone) => {
  const cleanedNumber = phone.replaceAll(" ", "").replace(/[a-zA-Z-]+/g, "")

  return `<a href="tel:${cleanedNumber}">${cleanedNumber}</a>`
}

const createDialogDaily = (restaurant, dialogNode, menu) => {
  const phone = restaurant.phone !== "-" ? createPhoneLink(restaurant.phone) : ""

  dialogNode.innerHTML = `
    <h1>${restaurant.name}</h1>
    <p>${restaurant.address}, ${restaurant.postalCode}, ${restaurant.city}</p>
    <p>${restaurant.company} ${phone}</p>
    <button class = "dailybutton2">${dailyMenuteksti}</button>
    <button class = "weeklybutton2">${weeklyMenuteksti}</button>

    <form method="dialog">
      <button class = "button">Sulje</button>
    </form>
  `}


