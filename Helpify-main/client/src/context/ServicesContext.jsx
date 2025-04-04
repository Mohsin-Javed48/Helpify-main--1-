import { createContext, useState, useContext } from 'react';

const ServicesContext = createContext();

function ServicesProvider({ children }) {
  // State for each service category
  const [acRepairServices, setAcRepairServices] = useState([]);
  const [carpenterServices, setCarpenterServices] = useState([]);
  const [electricianServices, setElectricianServices] = useState([]);
  const [gardnerServices, setGardnerServices] = useState([]);
  const [geyserServices, setGeyserServices] = useState([]);
  const [handymanServices, setHandymanServices] = useState([]);
  const [homeAppliancesServices, setHomeAppliancesServices] = useState([]);
  const [painterServices, setPainterServices] = useState([]);
  const [plumberServices, setPlumberServices] = useState([]);

  // Add services functions
  const addAcRepairService = (service) =>
    setAcRepairServices((prev) => [...prev, service]);
  const addCarpenterService = (service) =>
    setCarpenterServices((prev) => [...prev, service]);
  const addElectricianService = (service) =>
    setElectricianServices((prev) => [...prev, service]);
  const addGardnerService = (service) =>
    setGardnerServices((prev) => [...prev, service]);
  const addGeyserService = (service) =>
    setGeyserServices((prev) => [...prev, service]);
  const addHandymanService = (service) =>
    setHandymanServices((prev) => [...prev, service]);
  const addHomeAppliancesService = (service) =>
    setHomeAppliancesServices((prev) => [...prev, service]);
  const addPainterService = (service) =>
    setPainterServices((prev) => [...prev, service]);
  const addPlumberService = (service) =>
    setPlumberServices((prev) => [...prev, service]);

  // Update services functions
  const updateAcRepairServices = (newServices) =>
    setAcRepairServices(newServices);
  const updateCarpenterServices = (newServices) =>
    setCarpenterServices(newServices);
  const updateElectricianServices = (newServices) =>
    setElectricianServices(newServices);
  const updateGardnerServices = (newServices) =>
    setGardnerServices(newServices);
  const updateGeyserServices = (newServices) => setGeyserServices(newServices);
  const updateHandymanServices = (newServices) =>
    setHandymanServices(newServices);
  const updateHomeAppliancesServices = (newServices) =>
    setHomeAppliancesServices(newServices);
  const updatePainterServices = (newServices) =>
    setPainterServices(newServices);
  const updatePlumberServices = (newServices) =>
    setPlumberServices(newServices);

  const servicesValue = {
    acRepairServices,
    addAcRepairService,
    updateAcRepairServices,
    carpenterServices,
    addCarpenterService,
    updateCarpenterServices,
    electricianServices,
    addElectricianService,
    updateElectricianServices,
    gardnerServices,
    addGardnerService,
    updateGardnerServices,
    geyserServices,
    addGeyserService,
    updateGeyserServices,
    handymanServices,
    addHandymanService,
    updateHandymanServices,
    homeAppliancesServices,
    addHomeAppliancesService,
    updateHomeAppliancesServices,
    painterServices,
    addPainterService,
    updatePainterServices,
    plumberServices,
    addPlumberService,
    updatePlumberServices,
  };

  return (
    <ServicesContext.Provider value={servicesValue}>
      {children}
    </ServicesContext.Provider>
  );
}

export const useServices = () => useContext(ServicesContext);
export { ServicesProvider, ServicesContext };
