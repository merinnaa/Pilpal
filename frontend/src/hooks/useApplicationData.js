import { useEffect, useReducer } from 'react';
import axios from 'axios';


// Define the initial state for the reducer
const initialState = {
  user: null,
  userSupplements: [],
  refreshDashboard: false
};

// Define action types as constants
const ACTIONS = {
  SET_USER: 'SET_USER',
  GET_SUPPLEMENTS_FOR_USER: 'SET_SUPPLEMENTS_FOR_USER',
  SET_REFRESHDASHBOARD: 'SET_REFRESHDASHBOARD'
};

// Define the reducer function to handle state updates
const appReducer = (state, action) => {
  switch (action.type) {

    case ACTIONS.SET_USER:
      // Handle setting the modal open state
      return { ...state, user: action.payload.user };

    case ACTIONS.GET_SUPPLEMENTS_FOR_USER:
      // Handle setting the user supplement state
      return { ...state, userSupplements: action.payload.userSupplements };
      
    case ACTIONS.SET_REFRESHDASHBOARD:
      // Handle setting the user supplement list state
      return { ...state, refreshDashboard: !state.refreshDashboard };
      
    default:
      return state;
  }
}

// Custom hook for managing application data with a reducer
const useApplicationData = () => {
  // Use the useReducer hook to manage state with the appReducer function
  const [state, dispatch] = useReducer(appReducer, initialState);

  const setRefreshDashboard = () => {    
    dispatch({ type: ACTIONS.SET_REFRESHDASHBOARD });
  }  

  const login = (email, password) => {
    // console.log("login():", email, password);
    const body = {
      "email": email,
      "password": password    
    }
    axios.post('http://localhost:8080/users/login', body, { withCredentials: true })
      .then((response) => {
        const loggedUser = response.data.userFound;
        // console.log(response.data.userFound);
        dispatch({ type: ACTIONS.SET_USER, payload: { user: loggedUser } });
      })
      .catch((error) => {
        console.error('Error while making POST request:', error);
      });
  };

  const signUp = ({email, password, username}) => {
    const body = {
      "username": username,
      "email": email,
      "password": password    
    }

    axios.post('http://localhost:8080/users/signup', body, { withCredentials: true })
      .then((response) => {
        // console.log("response:", response.data);
        console.log('User successfully registered:', response.data);
      })
      .catch((error) => {
        console.error('Error while making POST request:', error);
      });
  };

  const takeSupplement = (supplementId, newValue) => {
    const body = {
      "supplementId": supplementId,
      "newValue": newValue    
    }

    // console.log(body);

    axios.post('http://localhost:8080/supplement_usage/updateStockLevel', body, { withCredentials: true })
      .then((response) => {
        console.log('Supplement successfully taken:', response.data);
        setRefreshDashboard();
      })
      .catch((error) => {
        console.error('Error while making POST request:', error);
      });
  };

  const addNewSupplement = (formData) => {
    const body = {
      'formData': formData
    }

    console.log(body);
    
    axios.post('http://localhost:8080/supplements/addSupplement', body, { withCredentials: true })
      .then((response) => {
        console.log('Supplement successfully add:', response.data);
        setRefreshDashboard();
      })
      .catch((error) => {
        console.error('Error while making POST request:', error);
      });
  };

  // Fetch user's supplements when the user logs in
  useEffect(() => {
    if (state.user || state.refreshDashboard) {
      axios.get('http://localhost:8080/user_supplements', { withCredentials: true })
        .then((response) => {
          const userSupplements = response.data.userSupplements;
            // console.log('userSupplements - ', userSupplements);
          dispatch({ type: ACTIONS.GET_SUPPLEMENTS_FOR_USER, payload: { userSupplements } });
          // setRefreshDashboard();
        })
        .catch((error) => {
          console.error('Error fetching user supplements:', error);
        });
    }
  }, [state.user, state.refreshDashboard]);

  const handleRefillAlert = (supplementId) => {
    const confirmRefill = () => {
      const response = prompt("Are you sure you want to refill? (Yes/No)");
      
      if (response === null || response.trim() === "") {
        console.log("Refill canceled");
        return; // Exit the function or handle accordingly
      }
    
      const cleanedResponse = response.trim().toLowerCase();
    
      if (cleanedResponse === "yes") {
        // Handle refill logic when the user confirms "Yes"
        const body = {
          "userId": state.user.id
        }
        axios.post(`http://localhost:8080/supplement_usage/${supplementId}`, body, { withCredentials: true })
          .then((response) => {
            // console.log(response.data.message);
            if (response.data.message.length > 0) {
              setRefreshDashboard();
              console.log("Refill confirmed");
            } else {
              console.log("No data returned, check response data:", response.data.message);
            }
          })
          .catch((error) => {
            console.error('Error while making POST request to supplement_usage:', error);
          });

      } else if (cleanedResponse === "no") {
        // Handle when the user responds with "No"
        console.log("Refill canceled");
      } else {
        // If the response is neither "Yes" nor "No", prompt again for valid input
        console.log("Please enter a valid response (Yes/No)");
        confirmRefill(); // Recursive call until valid response
      }
    };
    confirmRefill();
  };
  

  const logout = () => {
    dispatch({ type: ACTIONS.SET_USER, payload: { user: null } });
  };

  const editSupplement = (formData) => {
    const body = {
      'formData': formData
    }

    console.log(body);
    
    axios.post('http://localhost:8080/supplements/editSupplement', body, { withCredentials: true })
      .then((response) => {
        console.log('Supplement successfully edited:', response.data);
      })
      .catch((error) => {
        console.error('Error while making POST request:', error);
      });    
  };

  const getSupplementById  = (supplementId) => {
    return state.userSupplements.find(supplement => supplement.id === parseInt(supplementId));
  };



  return {
    state,
    actions: {
      login,
      logout,
      addNewSupplement,
      signUp,
      takeSupplement,
      handleRefillAlert,
      editSupplement,
      getSupplementById
    },
  };
};

export default useApplicationData;