import { faker } from '@faker-js/faker';
import { hash } from 'bcryptjs';
import chalk from 'chalk';

import { db } from './drizzle';
import { accounts, invites, members, projects, users } from './schema';
import { organizations } from './schema/organizations';

export async function seed() {
  console.log(chalk.yellow('✔ Cleaning database'));

  // Reset database
  await db.delete(users);
  console.log(chalk.yellow('x Users deleted'));
  await db.delete(organizations);
  console.log(chalk.yellow('x Organizations deleted'));
  await db.delete(members);
  console.log(chalk.yellow('x Members deleted'));
  await db.delete(projects);
  console.log(chalk.yellow('x Projects deleted'));
  await db.delete(accounts);
  console.log(chalk.yellow('x Accounts deleted'));
  await db.delete(invites);
  console.log(chalk.yellow('x Invites deleted'));

  console.log(chalk.yellow('x Database cleaned'));

  // Create users
  const passwordHash = await hash('passworddev', 1);

  const [user1, user2, user3] = await db
    .insert(users)
    .values([
      {
        name: 'John Doe',
        email: 'john@spinova.co',
        avatarUrl: faker.image.avatarGitHub(),
        passwordHash,
      },
      {
        name: faker.person.fullName(),
        email: faker.internet.email(),
        avatarUrl: faker.image.avatarGitHub(),
        passwordHash,
      },
      {
        name: faker.person.fullName(),
        email: faker.internet.email(),
        avatarUrl: faker.image.avatarGitHub(),
        passwordHash,
      },
    ])
    .returning();

  // Create organizations
  const [organization] = await db
    .insert(organizations)
    .values([
      {
        name: 'Spinova',
        slug: 'spinova',
        ownerId: user1.id,
        avatarUrl: faker.image.avatarGitHub(),
        domain: 'spinova.co',
        shouldAttachUsersByDomain: true,
      },
    ])
    .returning();

  // Create projects
  await db
    .insert(projects)
    .values([
      {
        name: faker.lorem.words(5),
        slug: faker.lorem.slug(5),
        description: faker.lorem.paragraph(),
        avatarUrl: faker.image.avatarGitHub(),
        ownerId: faker.helpers.arrayElement([user1.id, user2.id, user3.id]),
        organizationId: organization.id,
      },
      {
        name: faker.lorem.words(5),
        slug: faker.lorem.slug(5),
        description: faker.lorem.paragraph(),
        avatarUrl: faker.image.avatarGitHub(),
        ownerId: faker.helpers.arrayElement([user1.id, user2.id, user3.id]),
        organizationId: organization.id,
      },
      {
        name: faker.lorem.words(5),
        slug: faker.lorem.slug(5),
        description: faker.lorem.paragraph(),
        avatarUrl: faker.image.avatarGitHub(),
        ownerId: faker.helpers.arrayElement([user1.id, user2.id, user3.id]),
        organizationId: organization.id,
      },
    ])
    .returning();

  // Create members
  await db.insert(members).values([
    {
      userId: user1.id,
      organizationId: organization.id,
      role: 'admin',
    },
    {
      userId: user2.id,
      organizationId: organization.id,
      role: 'member',
    },
    {
      userId: user3.id,
      organizationId: organization.id,
      role: 'member',
    },
  ]);
}

seed()
  .then(() => {
    console.log(chalk.green('✔ Seed completed'));
  })
  .catch((error) => {
    console.error(chalk.red('Seed failed'));
    console.error(error);
  })
  .finally(() => {
    process.exit();
  });
