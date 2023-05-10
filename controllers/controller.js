const State = require('../model/states');
const statesData = require('../model/states.json');

// Utility function to filter contiguous states
// const isContiguousState = (state) => !['AK', 'HI'].includes(state.stateCode);
const isContiguousState = (state) => {
    const nonContiguousStates = ['AK', 'HI'];
    return !nonContiguousStates.includes(state.code);
  };

// Get all states
const getStates = async (req, res) => {
    const contig = req.query.contig;
    let states = statesData;
  
    if (contig === "true") {
      states = states.filter(isContiguousState);
    } else if (contig === "false") {
      states = states.filter((state) => !isContiguousState(state));
    }
  
    const statesWithFunFacts = await Promise.all(
      states.map(async (state) => {
        const stateInDB = await State.findOne({ stateCode: state.code });
        const funFactsFromDB = stateInDB ? stateInDB.funFacts : [];
        const funFactsFromFile = state.funfacts || [];
        const mergedFunFacts = [...funFactsFromFile, ...funFactsFromDB];
        return { ...state, funfacts: mergedFunFacts };
      })
    );
  
    res.json(statesWithFunFacts);
  };
  
  


// Get state by state code
const getStateByCode = async (req, res) => {
    const stateCode = req.params.state.toUpperCase();
    const state = statesData.find((s) => s.code === stateCode);
  
    if (!state) {
      return res.status(404).json({ message: `State ${stateCode} is not found` });
    }
  
    const stateInDB = await State.findOne({ stateCode: state.code });
    const funFactsFromDB = stateInDB ? stateInDB.funFacts : [];
    const funFactsFromFile = state.funfacts || [];
    const mergedFunFacts = [...funFactsFromFile, ...funFactsFromDB];
  
    res.json({ ...state, funfacts: mergedFunFacts });
  };



// Get fun fact for a state
// const getFunFact = async (req, res) => {
//     const stateCode = req.params.state.toUpperCase();
//     const stateInfo = await ExtendedStateInfo.findOne({ stateCode });

//     if (!stateInfo || stateInfo.funFacts.length === 0) {
//         return res.status(404).json({ message: `No fun facts found for state ${stateCode}` });
//     }

//     const randomIndex = Math.floor(Math.random() * stateInfo.funFacts.length);
//     res.json({ funFact: stateInfo.funFacts[randomIndex] });
// };
const getFunFact = async (req, res) => {
    const stateCode = req.params.state.toUpperCase();
    const state = statesData.find((s) => s.code === stateCode);
  
    if (!state) {
      return res.status(404).json({ message: `State ${stateCode} is not found` });
    }
  
    try {
      const stateInDB = await State.findOne({ stateCode: state.code });
      const funFactsFromDB = stateInDB ? stateInDB.funFacts : [];
      const funFactsFromFile = state.funfacts || [];
      const mergedFunFacts = [...funFactsFromFile, ...funFactsFromDB];
  
      if (mergedFunFacts.length === 0) {
        return res.status(404).json({ message: `No fun facts found for state ${stateCode}` });
      }
  
      const randomFunFact = mergedFunFacts[Math.floor(Math.random() * mergedFunFacts.length)];
      res.json({ funfact: randomFunFact });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "An error occurred while retrieving fun facts" });
    }
  };
  
  



// Get capital for a state
const getCapital = (req, res) => {
    const stateCode = req.params.state.toUpperCase();
    const stateData = statesData.find(state => state.code === stateCode);

    if (!stateData) {
        return res.status(404).json({ message: `State ${stateCode} not found` });
    }

    res.json({ state: stateData.state, capital: stateData.capital_city });
};

// Get nickname for a state
const getNickname = (req, res) => {
    const stateCode = req.params.state.toUpperCase();
    const stateData = statesData.find(state => state.code === stateCode);

    if (!stateData) {
        return res.status(404).json({ message: `State ${stateCode} not found` });
    }

    res.json({ state: stateData.state, nickname: stateData.nickname });
};

// Get population for a state
const getPopulation = (req, res) => {
    const stateCode = req.params.state.toUpperCase();
    const stateData = statesData.find(state => state.code === stateCode);

    if (!stateData) {
        return res.status(404).json({ message: `State ${stateCode} not found` });
    }

    res.json({ state: stateData.state, population: stateData.population });
};

// Get admission date for a state
const getAdmission = (req, res) => {
    const stateCode = req.params.state.toUpperCase();
    const stateData = statesData.find(state => state.code === stateCode);

    if (!stateData) {
        return res.status(404).json({ message: `State ${stateCode} not found` });
    }

    res.json({ state: stateData.state, admitted: stateData.admission_date });
};

// Create a new fun fact
const createFunFact = async (req, res) => {
    const stateCode = req.params.state.toUpperCase();
  
    if (!req.body.funfacts || !Array.isArray(req.body.funfacts) || req.body.funfacts.length === 0) {
      return res.status(400).json({ message: "Funfacts should be a non-empty array" });
    }
  
    const existingStateData = statesData.find((state) => state.code === stateCode);
  
    if (!existingStateData) {
      return res.status(400).json({ message: `State ${stateCode} is not found` });
    }
  
    const existingFunFacts = [...existingStateData.funfacts];
  
    const stateInDb = await State.findOne({ stateCode: stateCode });
  
    if (stateInDb && stateInDb.funFacts) {
      existingFunFacts.push(...stateInDb.funFacts);
    }
  
    const uniqueFunFacts = req.body.funfacts.filter(
      (funFact) => !existingFunFacts.includes(funFact)
    );
  
    if (uniqueFunFacts.length === 0) {
      return res
        .status(400)
        .json({ message: "All submitted fun facts already exist for this state" });
    }
  
    const updatedStateData = await State.findOneAndUpdate(
      { stateCode: stateCode },
      { $push: { funFacts: { $each: uniqueFunFacts } } },
      { new: true, upsert: true }
    );
  
    res.status(201).json(updatedStateData);
  };
  
  
  

// Update a fun fact
const updateFunFact = async (req, res) => {
    const stateCode = req.params.state.toUpperCase();
    const { index, funfact } = req.body;
  
    if (!index || !funfact) {
      return res.status(400).json({ message: "Both index and funfact fields are required in the request body" });
    }
  
    const adjustedIndex = index - 1;
  
    const stateInDB = await State.findOne({ stateCode });
  
    if (!stateInDB) {
      return res.status(404).json({ message: `State ${stateCode} is not found in the database` });
    }
  
    if (adjustedIndex < 0 || adjustedIndex >= stateInDB.funFacts.length) {
      return res.status(400).json({ message: "The provided index is out of range" });
    }
  
    stateInDB.funFacts[adjustedIndex] = funfact;
    await stateInDB.save();
  
    res.json({ message: `Fun fact at index ${index} was updated successfully`, state: stateInDB });
  };
  


// Delete a fun fact
const deleteFunFact = async (req, res) => {
    const stateCode = req.params.state.toUpperCase();
    const { index } = req.body;

    if (!index) {
        return res.status(400).json({ message: "Index must be provided" });
    }

    const stateInfo = await State.findOne({ stateCode });
    console.log('State code:', stateCode);
console.log('State info from DB:', stateInfo);


    if (!stateInfo) {
        return res.status(404).json({ message: `State ${stateCode} not found` });
    }
    const adjustedIndex = index - 1;

if (adjustedIndex < 0 || adjustedIndex >= stateInfo.funFacts.length) {
    return res.status(400).json({ message: "Invalid index value" });
}

stateInfo.funFacts.splice(adjustedIndex, 1);
const updatedStateInfo = await stateInfo.save();

res.json(updatedStateInfo);

};

module.exports = {
getStates,
getStateByCode,
getFunFact,
getCapital,
getNickname,
getPopulation,
getAdmission,
createFunFact,
updateFunFact,
deleteFunFact,
};