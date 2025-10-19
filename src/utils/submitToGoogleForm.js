export const submitToGoogleForm = ({ name, registerNumber, year, college, phone, score }) => {
  const formData = new FormData();
  formData.append('entry.1806152426', name);
  formData.append('entry.460263363', registerNumber);
  formData.append('entry.1628754189', year);
  formData.append('entry.1272037089', college);
  formData.append('entry.132313767', phone);
  formData.append('entry.2001285583', score);

  fetch('https://docs.google.com/forms/d/e/1FAIpQLSfBywJ2LukxQW4v-0u4V0RDiVzKS3IMNa-vR123T1NDjnsang/formResponse', {
    method: 'POST',
    mode: 'no-cors',
    body: formData
  });
};
