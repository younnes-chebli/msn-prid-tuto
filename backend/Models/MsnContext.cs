using Microsoft.EntityFrameworkCore;

namespace prid_tuto.Models;

public class MsnContext : DbContext
{
    public MsnContext(DbContextOptions<MsnContext> options)
        : base(options) {
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder) {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<Member>().HasIndex(m => m.FullName).IsUnique();

        modelBuilder.Entity<Member>().HasData(
            new Member { Pseudo = "admin", Password = "admin", FullName = "Admin", Role = Role.Admin },
            new Member { Pseudo = "ben", Password = "ben", FullName = "Benoît Penelle", BirthDate = new DateTime(1970, 1, 2) },
            new Member { Pseudo = "bruno", Password = "bruno", FullName = "Bruno Lacroix", BirthDate = new DateTime(1971, 2, 3) },
            new Member { Pseudo = "alain", Password = "alain", FullName = "Alain Silovy" },
            new Member { Pseudo = "xavier", Password = "xavier", FullName = "Xavier Pigeolet" },
            new Member { Pseudo = "boris", Password = "boris", FullName = "Boris Verhaegen" },
            new Member { Pseudo = "marc", Password = "marc", FullName = "Marc Michel" }
        );

        modelBuilder.Entity<Phone>().HasData(
            new Phone { PhoneId = 1, Type = "aaa", Number = "123", MemberPseudo = "ben" },
            new Phone { PhoneId = 2, Type = "bbb", Number = "456", MemberPseudo = "ben" }
        );
    }

    public DbSet<Member> Members => Set<Member>();
    public DbSet<Phone> Phones => Set<Phone>();
}
