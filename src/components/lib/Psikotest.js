
const getKelas = (item = '') => {
    // function split string
    let response = item?item.split('/'):null;

    return response?response[0]:null;
  };
const Fungsi = {
    getKelas,
  };
  export default Fungsi;
  