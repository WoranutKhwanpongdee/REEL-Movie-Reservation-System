import sys
import os

backend_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, backend_dir)

from datetime import datetime, timedelta
from app.database import SessionLocal, engine, Base
from app.models import *  # noqa: F401,F403
from app.models.user import User
from app.models.movie import Movie
from app.models.cinema import Cinema
from app.models.showtime import Showtime
from app.models.booking import Booking, BookingStatus
from app.models.seat import Seat
from app.core.security import get_password_hash

Base.metadata.create_all(bind=engine)

db = SessionLocal()

# ── Clear existing data (order respects FK constraints) ───────────────────────
db.query(Booking).delete()
db.query(Seat).delete()
db.query(Showtime).delete()
db.query(Movie).delete()
db.query(Cinema).delete()
db.query(User).delete()
db.commit()

# ── Users ─────────────────────────────────────────────────────────────────────
admin = User(
    name="Admin",
    email="admin@reel.com",
    hashed_password=get_password_hash("admin123"),
    is_admin=True,
)
user1 = User(
    name="John Carter",
    email="john@example.com",
    hashed_password=get_password_hash("password123"),
)
db.add_all([admin, user1])
db.commit()
db.refresh(admin)
db.refresh(user1)

# ── Movies ────────────────────────────────────────────────────────────────────
movies_data = [
    # ── 2026 Premieres & Blockbusters ──────────────────────────────────────────
    Movie(
        title="Spider-Man: Brand New Day",
        description="Peter Parker embraces a fresh beginning living under the radar in New York City, balancing street-level justice with a looming multiversal threat that will redefine what it means to be Spider-Man.",
        genre="Action",
        duration=152,
        rating=9.3,
        release_year=2026,
        director="Destin Daniel Cretton",
        cast="Tom Holland, Zendaya, Jacob Batalon, Sadie Sink, Charlie Cox, Mark Ruffalo",
        poster_url="https://www.themoviedb.org/t/p/w1280/xymJy9XwXxoiNo64smFvcHjVo5J.jpg",
        backdrop_url="https://image.tmdb.org/t/p/original/muth4OYamXf41G2evdrLEg8d3om.jpg",
        trailer_url="https://www.youtube.com/watch?v=cqGjhVJWtEg",
        is_featured=True,
    ),
    Movie(
        title="Avatar: Fire and Ash",
        description="Jake Sully and Neytiri encounter the Ash People, a volcanic and aggressive Na'vi clan led by Varang, testing their family's survival and the future of Pandora.",
        genre="Sci-Fi",
        duration=190,
        rating=9.1,
        release_year=2026,
        director="James Cameron",
        cast="Sam Worthington, Zoe Saldaña, Sigourney Weaver, Stephen Lang, Oona Chaplin",
        poster_url="https://image.tmdb.org/t/p/w500/lhyuZnCVIGOCXnJqYL0HMLPNOvt.jpg",
        backdrop_url="https://image.tmdb.org/t/p/original/sdZSjtGUTSN8B3al5o0f2WoQfQQ.jpg",
        trailer_url="https://www.youtube.com/watch?v=d9MyW72ELq0",
        is_featured=True,
    ),
    Movie(
        title="Wicked: For Good",
        description="The emotional and spectacle-filled conclusion to the story of Elphaba and Glinda as their choices shape the magical Land of Oz forever.",
        genre="Drama",
        duration=145,
        rating=8.8,
        release_year=2025,
        director="Jon M. Chu",
        cast="Cynthia Erivo, Ariana Grande, Jonathan Bailey, Jeff Goldblum, Michelle Yeoh",
        poster_url="https://image.tmdb.org/t/p/w500/xDGbZ0JJ3mYaGKy4Nzd9Kph6M9L.jpg",
        backdrop_url="https://image.tmdb.org/t/p/original/fyZ6SDUS4o9jp2EHxfZa3qS9ean.jpg",
        trailer_url="https://www.youtube.com/watch?v=6COmYeLsz4c",
        is_featured=True,
    ),
    Movie(
        title="Avengers: Doomsday",
        description="Earth's Mightiest Heroes and allies across the multiverse unite to confront their greatest adversary, Doctor Victor von Doom, in a catastrophe that will reshape reality forever.",
        genre="Action",
        duration=175,
        rating=9.2,
        release_year=2026,
        director="Anthony Russo, Joe Russo",
        cast="Robert Downey Jr., Pedro Pascal, Vanessa Kirby, Joseph Quinn, Ebon Moss-Bachrach, Anthony Mackie",
        poster_url="https://image.tmdb.org/t/p/w500/p3hxsbdIz0aipMziB8lkIlulLlW.jpg",
        backdrop_url="https://image.tmdb.org/t/p/original/s4v0UX1anfXm0UvloLsTTJ4v222.jpg",
        trailer_url="https://www.youtube.com/watch?v=TcMBFSGVi1c",
        is_featured=True,
    ),
    Movie(
        title="The Batman Part II",
        description="The Dark Knight plunges deeper into the frozen chaos of Gotham City's criminal underworld as fresh adversaries emerge to test Bruce Wayne's vow of vengeance and justice.",
        genre="Action",
        duration=168,
        rating=8.9,
        release_year=2026,
        director="Matt Reeves",
        cast="Robert Pattinson, Jeffrey Wright, Andy Serkis, Colin Farrell, Barry Keoghan",
        poster_url="https://image.tmdb.org/t/p/w500/7HE9Snpc710mM7ZvsTwkSQtGqJI.jpg",
        backdrop_url="https://image.tmdb.org/t/p/original/b0PlSFdDwbyK0cf5RxwDpaOJQvQ.jpg",
        trailer_url="https://www.youtube.com/watch?v=mqqft2x_Aa4",
        is_featured=True,
    ),
    Movie(
        title="Project Hail Mary",
        description="Astronaut Ryland Grace is the sole survivor on a desperate, last-chance interstellar mission to save humanity from an extinction-level solar crisis millions of miles from Earth.",
        genre="Sci-Fi",
        duration=156,
        rating=8.8,
        release_year=2026,
        director="Phil Lord, Christopher Miller",
        cast="Ryan Gosling, Sandra Hüller, Milana Vayntrub",
        poster_url="https://image.tmdb.org/t/p/w500/j2T8Um2m5yKr0GulAkp6ngHGr0q.jpg",
        backdrop_url="https://image.tmdb.org/t/p/original/jrudoaXcoLyHRPdolyOGemXgPEs.jpg",
        trailer_url="https://www.youtube.com/watch?v=zSWdZVtXT7E",
        is_featured=True,
    ),
    Movie(
        title="The Mandalorian & Grogu",
        description="The Mandalorian bounty hunter Din Djarin and his Force-sensitive apprentice Grogu embark on a brand new cinematic voyage across the outer rim of the galaxy.",
        genre="Sci-Fi",
        duration=135,
        rating=8.4,
        release_year=2026,
        director="Jon Favreau",
        cast="Pedro Pascal, Sigourney Weaver, Steve Blum",
        poster_url="https://image.tmdb.org/t/p/w500/sWgBv7LV2PRoQgkxwlibdGXKz1S.jpg",
        backdrop_url="https://image.tmdb.org/t/p/original/9zcbqSxdsRMZWHYtyCd1nXPr2xq.jpg",
        trailer_url="https://www.youtube.com/watch?v=aOC8E8R_N5c",
        is_featured=True,
    ),
    Movie(
        title="Toy Story 5",
        description="Woody, Buzz Lightyear, and the beloved crew face their most modern challenge yet: competing for children's imagination in the era of pervasive handheld screens and smart tech.",
        genre="Comedy",
        duration=104,
        rating=8.3,
        release_year=2026,
        director="Andrew Stanton",
        cast="Tom Hanks, Tim Allen, Joan Cusack, Tony Hale, Keegan-Michael Key",
        poster_url="https://image.tmdb.org/t/p/w500/uXDfjJbdP4ijW5hWSBrPrlKpxab.jpg",
        backdrop_url="https://image.tmdb.org/t/p/original/m67smI1IIMmYzCl9axvKNULVKLr.jpg",
        trailer_url="https://www.youtube.com/watch?v=wmiIUN-7qhE",
        is_featured=False,
    ),
    Movie(
        title="Supergirl: Woman of Tomorrow",
        description="Kara Zor-El travels the cosmos with Krypto the Superdog on an uncompromising quest across alien worlds, discovering strength forged through trauma and resilience.",
        genre="Action",
        duration=142,
        rating=8.1,
        release_year=2026,
        director="Craig Gillespie",
        cast="Milly Alcock, Matthias Schoenaerts, Eve Ridley",
        poster_url="https://image.tmdb.org/t/p/w500/aLAXEpRBrE7mT1SrxEWzD3R00aM.jpg",
        backdrop_url="https://image.tmdb.org/t/p/original/mmprryb2r0X8u9JkZCnaJIzyYX4.jpg",
        trailer_url="https://www.youtube.com/watch?v=Way9Dexny3w",
        is_featured=False,
    ),

    # ── Modern Classics & Masterpieces ──────────────────────────────────────────
    Movie(
        title="Dune: Part Two",
        description="Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family. Facing a choice between the love of his life and the fate of the universe, he endeavors to prevent a terrible future only he can foresee.",
        genre="Sci-Fi",
        duration=166,
        rating=8.6,
        release_year=2024,
        director="Denis Villeneuve",
        cast="Timothée Chalamet, Zendaya, Rebecca Ferguson, Javier Bardem, Austin Butler",
        poster_url="https://image.tmdb.org/t/p/w500/7KUXQmeXjDAwenHGvkqENw1uZMQ.jpg",
        backdrop_url="https://image.tmdb.org/t/p/original/eZ239CUp1d6OryZEBPnO2n87gMG.jpg",
        trailer_url="https://www.youtube.com/watch?v=Way9Dexny3w",
        is_featured=True,
    ),
    Movie(
        title="Oppenheimer",
        description="The story of J. Robert Oppenheimer's role in the development of the atomic bomb during World War II, examining the brilliance, hubris, and relentless momentum of historical change.",
        genre="Drama",
        duration=180,
        rating=8.9,
        release_year=2023,
        director="Christopher Nolan",
        cast="Cillian Murphy, Emily Blunt, Matt Damon, Robert Downey Jr., Florence Pugh",
        poster_url="https://image.tmdb.org/t/p/w500/mXOpcMOEruhz4BX3vXnIYe3rYDM.jpg",
        backdrop_url="https://image.tmdb.org/t/p/original/neeNHeXjMF5fXoCJRsOmkNGC7q.jpg",
        trailer_url="https://www.youtube.com/watch?v=uYPbbksJxIg",
        is_featured=True,
    ),
    Movie(
        title="Alien: Romulus",
        description="While scavenging the deep ends of a derelict space station, a group of young space colonizers come face to face with the most terrifying and unrelenting life form in the universe.",
        genre="Horror",
        duration=119,
        rating=7.4,
        release_year=2024,
        director="Fede Álvarez",
        cast="Cailee Spaeny, David Jonsson, Archie Renaux, Isabela Merced",
        poster_url="https://image.tmdb.org/t/p/w500/gzMmQCa3mPm0mLu7m246LAQE7Ca.jpg",
        backdrop_url="https://image.tmdb.org/t/p/original/iYqSQaWDttQIQzsxg9xHyg0bttG.jpg",
        trailer_url="https://www.youtube.com/watch?v=x0XDEhP4MQs",
        is_featured=False,
    ),
    Movie(
        title="Gladiator II",
        description="Years after witnessing the death of the revered hero Maximus at the hands of his uncle, Lucius must enter the Colosseum after his home is conquered by the tyrannical Emperors who now lead Rome with an iron fist.",
        genre="Action",
        duration=148,
        rating=7.2,
        release_year=2024,
        director="Ridley Scott",
        cast="Paul Mescal, Pedro Pascal, Denzel Washington, Connie Nielsen",
        poster_url="https://image.tmdb.org/t/p/w500/lj1G5qICeuuaHiwqmFl1r2eZYyI.jpg",
        backdrop_url="https://image.tmdb.org/t/p/original/tOqIwliWMovSIZ9DyvHcHI7p2im.jpg",
        trailer_url="https://www.youtube.com/watch?v=4rgYUipGJNo",
        is_featured=False,
    ),
    Movie(
        title="Interstellar",
        description="When Earth becomes uninhabitable in the future, a farmer and ex-NASA pilot, Joseph Cooper, is tasked to pilot a spacecraft, along with a team of researchers, to find a new planet for humans.",
        genre="Sci-Fi",
        duration=169,
        rating=8.7,
        release_year=2014,
        director="Christopher Nolan",
        cast="Matthew McConaughey, Anne Hathaway, Jessica Chastain, Michael Caine",
        poster_url="https://image.tmdb.org/t/p/w500/aDJlk2mPEo0weBzJ1eikAqZeHwS.jpg",
        backdrop_url="https://image.tmdb.org/t/p/original/5XNQBqnBwPA9yT0jZ0p3s8bbLh0.jpg",
        trailer_url="https://www.youtube.com/watch?v=zSWdZVtXT7E",
        is_featured=False,
    ),
    Movie(
        title="Blade Runner 2049",
        description="Young Blade Runner K's discovery of a long-buried secret leads him to track down former Blade Runner Rick Deckard, who's been missing for thirty years.",
        genre="Sci-Fi",
        duration=164,
        rating=8.0,
        release_year=2017,
        director="Denis Villeneuve",
        cast="Ryan Gosling, Harrison Ford, Ana de Armas, Sylvia Hoeks, Robin Wright",
        poster_url="https://image.tmdb.org/t/p/w500/cjeP37p6UENGMo3nQ12Ee8tk76n.jpg",
        backdrop_url="https://image.tmdb.org/t/p/original/gNdLJU9TxrpGx4dkZidjys3fyy0.jpg",
        trailer_url="https://www.youtube.com/watch?v=gCcx85zbxz4",
        is_featured=False,
    ),
    Movie(
        title="Jurassic World",
        description="A new theme park, built on the original site of Jurassic Park, creates a genetically modified hybrid dinosaur, the Indominus Rex, which escapes containment and goes on a rampage.",
        genre="Action",
        duration=124,
        rating=7.0,
        release_year=2015,
        director="Colin Trevorrow",
        cast="Chris Pratt, Bryce Dallas Howard, Irrfan Khan, Vincent D'Onofrio, Ty Simpkins",
        poster_url="https://image.tmdb.org/t/p/w500/IivK8IcfCpFspkP7TQqLacLJQg.jpg",
        backdrop_url="https://image.tmdb.org/t/p/original/dF6FjTZzRTENfB4R17HDN20jLT2.jpg",
        trailer_url="https://www.youtube.com/watch?v=RFinNxS5GE4",
        is_featured=False,
    ),
]
db.add_all(movies_data)
db.commit()

# ── Cinemas ───────────────────────────────────────────────────────────────────
cinemas_data = [
    Cinema(
        name="REEL Grand Horizon IMAX",
        location="Empire Tower, 5th Ave, New York",
        description="Flagship venue with Laser IMAX 70mm, 12-channel spatial audio, and heated luxury recliner seating.",
        total_rows=8,
        seats_per_row=10,
    ),
    Cinema(
        name="REEL Dolby Cinema West",
        location="Sunset Blvd, West Hollywood, Los Angeles",
        description="Featuring dual 4K laser projection with Dolby Vision HDR and Dolby Atmos immersive sound system.",
        total_rows=7,
        seats_per_row=9,
    ),
    Cinema(
        name="REEL VIP Lounge & Suites",
        location="Michigan Ave, Millennium Park, Chicago",
        description="Boutique cinema offering in-seat gourmet dining, motorized full-flat recliners, and private bar service.",
        total_rows=6,
        seats_per_row=8,
    ),
]
db.add_all(cinemas_data)
db.commit()

# ── Showtimes & Initial Seats Generation ───────────────────────────────────────
now = datetime.now().replace(minute=0, second=0, microsecond=0)
formats = ["Standard", "IMAX", "Dolby Atmos", "4DX"]
time_slots = [(11, 0), (14, 15), (17, 30), (20, 45), (23, 15)]
prices = {"Standard": 14.50, "IMAX": 22.00, "Dolby Atmos": 19.50, "4DX": 24.00}

created_showtimes = []
for day_offset in range(7):
    day_date = now.date() + timedelta(days=day_offset)
    for movie_idx, movie in enumerate(movies_data):
        for cinema_idx, cinema in enumerate(cinemas_data):
            # Select 2 distinct time slots per cinema per movie
            slot_indices = [(movie_idx + cinema_idx) % len(time_slots), (movie_idx + cinema_idx + 2) % len(time_slots)]
            for s_idx in slot_indices:
                hour, minute = time_slots[s_idx]
                st_time = datetime.combine(day_date, datetime.min.time()).replace(hour=hour, minute=minute)
                fmt = formats[(movie_idx + cinema_idx + s_idx) % len(formats)]
                
                st = Showtime(
                    movie_id=movie.id,
                    cinema_id=cinema.id,
                    start_time=st_time,
                    price=prices[fmt],
                    format=fmt,
                )
                db.add(st)
                created_showtimes.append((st, cinema))

db.commit()

# Generate Seats for all showtimes
rows_letters = "ABCDEFGHIJ"
all_seats = []
for st, cinema in created_showtimes:
    rows = rows_letters[: cinema.total_rows]
    for row in rows:
        for num in range(1, cinema.seats_per_row + 1):
            seat = Seat(showtime_id=st.id, row=row, number=num, is_booked=False)
            all_seats.append(seat)

db.add_all(all_seats)
db.commit()

# ── Create Sample Initial Bookings for John Carter ────────────────────────────
sample_showtimes = [st for st, _ in created_showtimes[:3]]
ref_1 = "REL-8K4P9"
ref_2 = "REL-3X7W2"

# Booking 1: 2 seats for Dune: Part Two
st1 = sample_showtimes[0]
seat1 = db.query(Seat).filter(Seat.showtime_id == st1.id, Seat.row == "D", Seat.number == 5).first()
seat2 = db.query(Seat).filter(Seat.showtime_id == st1.id, Seat.row == "D", Seat.number == 6).first()
if seat1 and seat2:
    seat1.is_booked = True
    seat2.is_booked = True
    b1 = Booking(
        user_id=user1.id,
        showtime_id=st1.id,
        seat_id=seat1.id,
        status=BookingStatus.confirmed,
        total_price=st1.price,
        booking_reference=ref_1,
    )
    b2 = Booking(
        user_id=user1.id,
        showtime_id=st1.id,
        seat_id=seat2.id,
        status=BookingStatus.confirmed,
        total_price=st1.price,
        booking_reference=ref_1,
    )
    db.add_all([b1, b2])

# Booking 2: 1 seat for Oppenheimer
st2 = sample_showtimes[1]
seat3 = db.query(Seat).filter(Seat.showtime_id == st2.id, Seat.row == "E", Seat.number == 4).first()
if seat3:
    seat3.is_booked = True
    b3 = Booking(
        user_id=user1.id,
        showtime_id=st2.id,
        seat_id=seat3.id,
        status=BookingStatus.confirmed,
        total_price=st2.price,
        booking_reference=ref_2,
    )
    db.add(b3)

db.commit()
db.close()

print(" Database seeded successfully!")
print(f"   Users    : 2 (admin@reel.com / admin123, john@example.com / password123)")
print(f"   Movies   : {len(movies_data)}")
print(f"   Cinemas  : {len(cinemas_data)}")
print(f"   Showtimes: {len(created_showtimes)}")
print(f"   Seats    : {len(all_seats)}")
