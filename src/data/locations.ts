export interface LocationInfo {
  name: string;
  description: string;
  notes: string;
}

export const locations: { [region: string]: LocationInfo } = {
  eastern: {
    name: 'Eastern Suburbs',
    description: 'From Bondi to Vaucluse, we service homes and apartments across Sydney’s Eastern Suburbs.',
    notes: 'Many properties here face parking and strata constraints. Accurate site access details help us plan.',
  },
  innerwest: {
    name: 'Inner West',
    description: 'Heritage terraces and modern apartments abound in the Inner West. We tailor joinery to each.',
    notes: 'Consider ceiling heights and existing services when planning a new kitchen.',
  },
  northshore: {
    name: 'North Shore',
    description: 'Custom kitchens for houses and units from Chatswood to Wahroonga.',
    notes: 'Older homes may require service upgrades; apartments may need lift access management.',
  },
  northernbeaches: {
    name: 'Northern Beaches',
    description: 'Coastal kitchens designed to withstand humidity and salt air.',
    notes: 'Material selection is critical for longevity; consult us on marine-grade finishes.',
  },
  hills: {
    name: 'Hills District',
    description: 'Spacious family homes and new builds in the Hills.',
    notes: 'Popular open-plan layouts often include butler’s pantries or laundry integrations.',
  },
  west: {
    name: 'Parramatta & Western Sydney',
    description: 'Diverse housing stock and multicultural tastes are served across Western Sydney.',
    notes: 'Budget-conscious solutions available alongside premium finishes.',
  },
  southwest: {
    name: 'South West Sydney',
    description: 'Growth corridors with new estates and townhouses.',
    notes: 'We can coordinate with developers and builders for integrated joinery packages.',
  },
  shire: {
    name: 'Sutherland Shire',
    description: 'Coastal and family homes across the Shire receive our tailored designs.',
    notes: 'Strata and council regulations vary by suburb; let us help navigate compliance.',
  },
  cbd: {
    name: 'Sydney CBD & Apartments',
    description: 'High-rise apartments require careful logistics for material delivery and installation.',
    notes: 'Access restrictions, lift booking and noise curfews influence scheduling and cost.',
  },
};