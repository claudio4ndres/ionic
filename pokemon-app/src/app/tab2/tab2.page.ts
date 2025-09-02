import { Component, OnInit } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonChip, IonLabel, IonProgressBar, IonSpinner, IonBackButton, IonButtons } from '@ionic/angular/standalone';
import { ActivatedRoute } from '@angular/router';
import { PokemonService, Pokemon } from '../services/pokemon.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonChip, IonLabel, IonProgressBar, IonSpinner, IonBackButton, IonButtons, CommonModule]
})
export class Tab2Page implements OnInit {
  pokemon: Pokemon | null = null;
  isLoading = true;
  pokemonId: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private pokemonService: PokemonService
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.pokemonId = params.get('id');
      if (this.pokemonId) {
        this.loadPokemonDetails(this.pokemonId);
      }
    });
  }

  async loadPokemonDetails(id: string) {
    this.isLoading = true;
    try {
      this.pokemon = await this.pokemonService.getPokemonDetails(id).toPromise() || null;
    } catch (error) {
      console.error('Error loading Pokemon details:', error);
    } finally {
      this.isLoading = false;
    }
  }

  getPokemonImage(): string {
    if (!this.pokemon) return '';
    return this.pokemon.sprites?.other?.['official-artwork']?.front_default || 
           this.pokemon.sprites?.front_default || 
           'assets/pokemon-placeholder.png';
  }

  getTypeColor(type: string): string {
    const typeColors: { [key: string]: string } = {
      normal: '#A8A878',
      fire: '#F08030',
      water: '#6890F0',
      electric: '#F8D030',
      grass: '#78C850',
      ice: '#98D8D8',
      fighting: '#C03028',
      poison: '#A040A0',
      ground: '#E0C068',
      flying: '#A890F0',
      psychic: '#F85888',
      bug: '#A8B820',
      rock: '#B8A038',
      ghost: '#705898',
      dragon: '#7038F8',
      dark: '#705848',
      steel: '#B8B8D0',
      fairy: '#EE99AC'
    };
    return typeColors[type] || '#68A090';
  }

  getStatName(statName: string): string {
    const statNames: { [key: string]: string } = {
      'hp': 'HP',
      'attack': 'Ataque',
      'defense': 'Defensa',
      'special-attack': 'At. Esp.',
      'special-defense': 'Def. Esp.',
      'speed': 'Velocidad'
    };
    return statNames[statName] || statName;
  }
}
