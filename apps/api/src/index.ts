import { defineAbilityFor } from '@crm/auth';

const ability = defineAbilityFor({ role: 'MEMBER' });

console.log(ability.can('invite', 'User'));
