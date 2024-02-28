const authenticationConfig = () => {
  if (localStorage.getItem('token') !== '') {
    return {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      }
    };
  }
  return {
    headers: {
      'Content-Type': 'application/json'
    }
  };
};

export default authenticationConfig;
