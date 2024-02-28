const fetchUkraineCities = async () => {
  let fetchedCityList = [];

  await fetch("https://api.hh.ru/areas/5")
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      data.areas.map((area) => {
        if (area.name === "Киев") {
          fetchedCityList.push({ name: area.name });
        }
        area.areas.map((city) => {
          fetchedCityList.push({ name: city.name });
        });
      });
    });

  return fetchedCityList;
};

export { fetchUkraineCities };
