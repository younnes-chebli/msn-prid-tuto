using Microsoft.EntityFrameworkCore;

namespace prid_tuto.Models;

public class MsnContext : DbContext
{
    public MsnContext(DbContextOptions<MsnContext> options)
        : base(options) {
    }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder) {
        base.OnConfiguring(optionsBuilder);
        optionsBuilder
            .LogTo(Console.WriteLine, LogLevel.Information)
            .EnableSensitiveDataLogging();
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder) {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<Member>()
            .HasMany(left => left.Followers)
            .WithMany(right => right.Followees)
            .UsingEntity<Follow>(
                right => right.HasOne(m => m.Follower).WithMany(),
                left => left.HasOne(m => m.Followee).WithMany()
            );

        modelBuilder.Entity<Member>().HasIndex(m => m.FullName).IsUnique();

        modelBuilder.Entity<Member>().HasData(
            new Member { Pseudo = "admin", Password = "admin", FullName = "Admin", Role = Role.Admin },
            new Member { Pseudo = "harry", Password = "harry", FullName = "Harry Covère", BirthDate = new DateTime(1970, 1, 2) },
            new Member { Pseudo = "john", Password = "john", FullName = "John Deuf", BirthDate = new DateTime(1971, 2, 3) },
            new Member { Pseudo = "jim", Password = "jim", FullName = "Jim Nastik" },
            new Member { Pseudo = "camille", Password = "camille", FullName = "Camille Honnête" },
            new Member { Pseudo = "melusine", Password = "melusine", FullName = "Mélusine Enfayite" },
            new Member { Pseudo = "alain", Password = "alain", FullName = "Alain Terrieur" }
        );

        modelBuilder.Entity<Phone>().HasData(
            new Phone { PhoneId = 1, Type = "aaa", Number = "123", MemberPseudo = "harry" },
            new Phone { PhoneId = 2, Type = "bbb", Number = "456", MemberPseudo = "harry" }
        );

        modelBuilder.Entity<Follow>().HasData(
            new Follow { FollowerPseudo = "harry", FolloweePseudo = "john" },
            new Follow { FollowerPseudo = "harry", FolloweePseudo = "alain" },
            new Follow { FollowerPseudo = "john", FolloweePseudo = "melusine" },
            new Follow { FollowerPseudo = "john", FolloweePseudo = "harry" },
            new Follow { FollowerPseudo = "john", FolloweePseudo = "camille" }
        );
    }

    public DbSet<Member> Members => Set<Member>();
    public DbSet<Phone> Phones => Set<Phone>();
    public DbSet<Follow> Follows => Set<Follow>();
}
