using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using prid_tuto.Models;
using AutoMapper;
using System.IdentityModel.Tokens.Jwt;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using prid_tuto.Helpers;

namespace prid_tuto.Controllers;

[Authorize]
[Route("api/[controller]")]
[ApiController]
public class MembersController : ControllerBase
{
    private readonly MsnContext _context;
    private readonly IMapper _mapper;

    /*
    Le contrôleur est instancié automatiquement par ASP.NET Core quand une requête HTTP est reçue.
    Les deux paramètres du constructeur recoivent automatiquement, par injection de dépendance, 
    une instance du context EF (MsnContext) et une instance de l'auto-mapper (IMapper).
    */
    public MembersController(MsnContext context, IMapper mapper) {
        _context = context;
        _mapper = mapper;
    }

    [AllowAnonymous]
    [HttpPost("authenticate")]
    public async Task<ActionResult<MemberDTO>> Authenticate(MemberWithPasswordDTO dto) {
        var member = await Authenticate(dto.Pseudo, dto.Password);

        var result = await new MemberValidator(_context).ValidateForAuthenticate(member);
        if (!result.IsValid)
            return BadRequest(result);

        return Ok(_mapper.Map<MemberDTO>(member));
    }

    private async Task<Member?> Authenticate(string pseudo, string password) {
        var member = await _context.Members.FindAsync(pseudo);

        // return null if member not found
        if (member == null)
            return null;

        if (member.Password == password) {
            // authentication successful so generate jwt token
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes("my-super-secret-key");
            var tokenDescriptor = new SecurityTokenDescriptor {
                Subject = new ClaimsIdentity(new Claim[] {
                    new Claim(ClaimTypes.Name, member.Pseudo),
                    new Claim(ClaimTypes.Role, member.Role.ToString())
                }),
                IssuedAt = DateTime.UtcNow,
                Expires = DateTime.UtcNow.AddMinutes(10),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };
            var token = tokenHandler.CreateToken(tokenDescriptor);
            member.Token = tokenHandler.WriteToken(token);
        }

        return member;
    }

    // GET: api/Members
    [Authorized(Role.Admin)]
    [HttpGet]
    public async Task<ActionResult<IEnumerable<MemberDTO>>> GetAll() {
        /*
        Remarque: La ligne suivante ne marche pas :
            return _mapper.Map<IEnumerable<MemberDTO>>(await _context.Members.ToListAsync());
        En effet :
            C# doesn't support implicit cast operators on interfaces. Consequently, conversion of the interface to a concrete type is necessary to use ActionResult<T>.
            See: https://docs.microsoft.com/en-us/aspnet/core/web-api/action-return-types?view=aspnetcore-5.0#actionresultt-type
        */

        // Récupère une liste de tous les membres et utilise le mapper pour les transformer en leur DTO
        return _mapper.Map<List<MemberDTO>>(await _context.Members.Include(m => m.Phones).ToListAsync());

    }

    // GET: api/Members/ben
    [HttpGet("{pseudo}")]
    public async Task<ActionResult<MemberDTO>> GetOne(string pseudo) {
        // Récupère en BD le membre dont le pseudo est passé en paramètre dans l'url
        var member = await _context.Members.Include(m => m.Phones).SingleOrDefaultAsync(m => m.Pseudo == pseudo);
        // Si aucun membre n'a été trouvé, renvoyer une erreur 404 Not Found
        if (member == null)
            return NotFound();
        // Transforme le membre en son DTO et retourne ce dernier
        return _mapper.Map<MemberDTO>(member);
    }

    [HttpPost]
    public async Task<ActionResult<MemberDTO>> PostMember(MemberWithPasswordDTO member) {
        // Utilise le mapper pour convertir le DTO qu'on a reçu en une instance de Member
        var newMember = _mapper.Map<Member>(member);
        // Valide les données
        var result = await new MemberValidator(_context).ValidateOnCreate(newMember);
        if (!result.IsValid)
            return BadRequest(result);
        // Ajoute ce nouveau membre au contexte EF
        _context.Members.Add(newMember);
        // Sauve les changements
        await _context.SaveChangesAsync();

        // Renvoie une réponse ayant dans son body les données du nouveau membre (3ème paramètre)
        // et ayant dans ses headers une entrée 'Location' qui contient l'url associé à GetOne avec la bonne valeur 
        // pour le paramètre 'pseudo' de cet url.
        return CreatedAtAction(nameof(GetOne), new { pseudo = member.Pseudo }, _mapper.Map<MemberDTO>(newMember));
    }

    [Authorized(Role.Admin)]
    [HttpPut]
    public async Task<IActionResult> PutMember(MemberWithPasswordDTO dto) {
        // Récupère en BD le membre à mettre à jour
        var member = await _context.Members.Include(m => m.Phones).SingleOrDefaultAsync(m => m.Pseudo == dto.Pseudo);
        // Si aucun membre n'a été trouvé, renvoyer une erreur 404 Not Found
        if (member == null)
            return NotFound();
        // S'il n'y a pas de mot de passe dans le dto, on garde le mot de passe actuel
        if (string.IsNullOrEmpty(dto.Password))
            dto.Password = member.Password;
        // Mappe les données reçues sur celles du membre en question
        _mapper.Map<MemberWithPasswordDTO, Member>(dto, member);
        // Valide les données
        var result = await new MemberValidator(_context).ValidateAsync(member);
        if (!result.IsValid)
            return BadRequest(result);
        // Sauve les changements
        await _context.SaveChangesAsync();
        // Retourne un statut 204 avec une réponse vide
        return NoContent();
    }

    [Authorized(Role.Admin)]
    [HttpDelete("{pseudo}")]
    public async Task<IActionResult> DeleteMember(string pseudo) {
        // Récupère en BD le membre à supprimer
        var member = await _context.Members.FindAsync(pseudo);
        // Si aucun membre n'a été trouvé, renvoyer une erreur 404 Not Found
        if (member == null)
            return NotFound();
        // Indique au contexte EF qu'il faut supprimer ce membre
        _context.Members.Remove(member);
        // Sauve les changements
        await _context.SaveChangesAsync();
        // Retourne un statut 204 avec une réponse vide
        return NoContent();
    }
}
