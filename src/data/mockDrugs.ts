import { Drug } from '../types';

export const INITIAL_DRUGS: Drug[] = [
  {
    id: 'drug-1',
    name: 'Paracétamol 500mg (Doliprane)',
    genericName: 'Paracétamol',
    category: 'Antalgique / Anti-pyrétique',
    description: 'Soulagement des douleurs légères à modérées et de la fièvre.',
    dci: 'Paracetamol'
  },
  {
    id: 'drug-2',
    name: 'Amoxicilline 500mg (Clamoxyl)',
    genericName: 'Amoxicilline',
    category: 'Antibiotique Penicilline',
    description: 'Traitement des infections bactériennes à germes sensibles.',
    dci: 'Amoxicillin'
  },
  {
    id: 'drug-3',
    name: 'Artemether + Lumefantrine 80/480mg (Coartem / Artefan)',
    genericName: 'Artemether / Lumefantrine',
    category: 'Antipaludéen (CTA)',
    description: 'Traitement curatif du paludisme aigu à Plasmodium falciparum.',
    dci: 'Artemether/Lumefantrine'
  },
  {
    id: 'drug-4',
    name: 'Ibuprofène 400mg (Advill / Spidifen)',
    genericName: 'Ibuprofène',
    category: 'Anti-inflammatoire non stéroïdien (AINS)',
    description: 'Antalgique, anti-inflammatoire et antipyrétique.',
    dci: 'Ibuprofen'
  },
  {
    id: 'drug-5',
    name: 'Phloroglucinol 80mg (Spasfon)',
    genericName: 'Phloroglucinol',
    category: 'Antispasmodique',
    description: 'Traitement des douleurs spasmodiques de l\'intestin, des voies biliaires et gynécologiques.',
    dci: 'Phloroglucinol'
  },
  {
    id: 'drug-6',
    name: 'Oméprazole 20mg (Mopral)',
    genericName: 'Oméprazole',
    category: 'Antiulcéreux / IPP',
    description: 'Traitement du reflux gastro-œsophagien et des ulceres gastriques.',
    dci: 'Omeprazole'
  },
  {
    id: 'drug-7',
    name: 'Métformine 850mg (Glucophage)',
    genericName: 'Métformine',
    category: 'Antidiabétique oral',
    description: 'Traitement du diabète de type 2.',
    dci: 'Metformin'
  },
  {
    id: 'drug-8',
    name: 'Amlodipine 5mg (Amlor)',
    genericName: 'Amlodipine',
    category: 'Antihypertenseur',
    description: 'Traitement de l\'hypertension artérielle et de l\'angor.',
    dci: 'Amlodipine'
  },
  {
    id: 'drug-9',
    name: 'Salbutamol Inhalateur 100µg (Ventoline)',
    genericName: 'Salbutamol',
    category: 'Bronchodilatateur',
    description: 'Traitement de la crise d\'asthme et des bronchospasmes.',
    dci: 'Salbutamol'
  },
  {
    id: 'drug-11',
    name: 'Insuline Humaine (Mixtard / Lantus 100 UI/ml)',
    genericName: 'Insuline Injectable',
    category: 'Antidiabétique Injectable (Hormone)',
    description: 'Traitement du diabète insulino-dépendant (Type 1 et Type 2). Médicament vital.',
    dci: 'Insulin Human'
  },
  {
    id: 'drug-10',
    name: 'Vitamine C 1000mg Effervescent',
    genericName: 'Acide Ascorbique',
    category: 'Complément vitaminique',
    description: 'Traitement des états de fatigue passagère et déficit en vitamine C.',
    dci: 'Ascorbic Acid'
  }
];
