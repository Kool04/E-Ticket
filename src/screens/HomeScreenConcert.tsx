const getSpectacleDetails = async (ticketId: string) => {
  try {
    const ticketDocRef = doc(db, "ticket", ticketId);
    const ticketDocSnap = await getDoc(ticketDocRef);

    if (!ticketDocSnap.exists()) {
      console.error("No such ticket document!");
      return null;
    }

    const ticketData = ticketDocSnap.data();

    // Récupérer les données du spectacle
    const spectacleDocRef = doc(db, "spectacle", ticketData.id_spectacle);
    const spectacleDocSnap = await getDoc(spectacleDocRef);

    if (!spectacleDocSnap.exists()) {
      console.error("No such spectacle document!");
      return { ...ticketData, photo_couverture: null };
    }

    let spectacleData = spectacleDocSnap.data();

    // Récupérer les données de l'utilisateur
    const userDataRef = doc(db, "users", ticketData.id_users);
    const userDataSnap = await getDoc(userDataRef);

    if (!userDataSnap.exists()) {
      console.error("No such user document!");
      return { ...ticketData, photo_couverture: spectacleData.photo_couverture, heure: spectacleData.heure, nom_spectacle: spectacleData.nom_spectacle, date: spectacleData.date, lieu: spectacleData.lieu, userData: null };
    }

    const userData = userDataSnap.data();

    // Ajouter les données de userData à spectacleData
    spectacleData = {
      ...spectacleData,
      userData: {
        ...userData
        nom:userData.firstName,
        preneom:userData.lastName,
        email:userData.email,
      }
    };

    return {
      ...ticketData,
      photo_couverture: spectacleData.photo_couverture,
      heure: spectacleData.heure,
      nom_spectacle: spectacleData.nom_spectacle,
      date: spectacleData.date,
      lieu: spectacleData.lieu,
      userData: spectacleData.userData,
    };
  } catch (error) {
    console.error("Error fetching details: ", error);
    return null;
  }
};