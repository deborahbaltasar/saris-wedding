import { Department } from '../types';

// mapeia o enum numérico para labels em português
const departmentLabels: Record<Department, string> = {
  [Department.Bed]: 'Cama',
  [Department.Bath]: 'Banho',
  [Department.Kitchen]: 'Cozinha',
  [Department.Dining]: 'Jantar',
  [Department.Decor]: 'Decoração',
  [Department.Appliances]: 'Eletrodomésticos',
  [Department.Furniture]: 'Móveis',
  [Department.Electronics]: 'Eletrônicos',
  [Department.Outdoor]: 'Área externa',
  [Department.Organization]: 'Organização',
  [Department.Others]: 'Outros'
};

export const translateDepartment = (dep: Department): string => {
  return departmentLabels[dep] ?? 'Outros';
};